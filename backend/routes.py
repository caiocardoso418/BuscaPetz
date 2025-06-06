from flask import Blueprint, request, jsonify
from db import conectar
import os
from werkzeug.utils import secure_filename
from flask import current_app
from flask import send_from_directory

routes = Blueprint('routes', __name__)


@routes.route('/html/<path:filename>')
def servir_html(filename):
    return send_from_directory(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'html')), filename)


@routes.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO usuario (nome, email, senha) VALUES (%s, %s, %s)", (nome, email, senha))
        conn.commit()
        return jsonify({'mensagem': 'Usuário cadastrado com sucesso'}), 201
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@routes.route('/login', methods=['POST'])
def login_usuario():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM usuario WHERE email = %s AND senha = %s", (email, senha))
        usuario = cursor.fetchone()
        if usuario:
            return jsonify({
                'mensagem': 'Login realizado com sucesso',
                'id_usuario': usuario['id_usuario'],
                'email': usuario['email'],
                'nome': usuario['nome']
            }), 200

        else:
            return jsonify({'erro': 'Credenciais inválidas'}), 401
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@routes.route('/anunciar', methods=['POST'])
def anunciar_pet():
    data = request.get_json()

    try:
        conn = conectar()
        cursor = conn.cursor()

        sql = """
        INSERT INTO animal (nome, descricao, especie, genero, raca, porte, cor, endereco, foto, data_desaparecimento, telefone, status, id_usuario)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        valores = (
            data.get("nome"),
            data.get("descricao"),
            data.get("especie"),
            data.get("genero"),
            data.get("raca"),
            data.get("porte"),
            data.get("cor"),
            data.get("endereco"),
            data.get("foto"),
            data.get("data_desaparecimento"),
            data.get("telefone"),
            data.get("status"),
            data.get("id_usuario")
        )
        cursor.execute(sql, valores)
        conn.commit()

        return jsonify({"mensagem": "Pet anunciado com sucesso"}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@routes.route('/publicacoes', methods=['GET'])
def listar_publicacoes():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id_animal, nome, status, foto, endereco, data_desaparecimento, telefone,
                   especie, genero, raca, cor, porte, descricao, id_usuario
            FROM animal
            ORDER BY data_desaparecimento DESC
        """)
        animais = cursor.fetchall()
        return jsonify(animais), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@routes.route("/upload", methods=["POST"])
def upload_imagem():
    if 'foto' not in request.files:
        return jsonify({'erro': 'Nenhuma imagem enviada'}), 400

    file = request.files['foto']
    if file.filename == '':
        return jsonify({'erro': 'Nome de arquivo vazio'}), 400

    filename = secure_filename(file.filename)
    pasta_uploads = current_app.config['UPLOAD_FOLDER']
    os.makedirs(pasta_uploads, exist_ok=True)

    caminho = os.path.join(pasta_uploads, filename)
    file.save(caminho)

    return jsonify({'caminho': f'/static/uploads/{filename}'}), 200


@routes.route('/comentar', methods=['POST'])
def adicionar_comentario():
    data = request.get_json()
    id_usuario = data.get('id_usuario')
    id_animal = data.get('id_animal')
    texto = data.get('texto')

    if not id_usuario or not id_animal or not texto:
        return jsonify({'erro': 'Campos obrigatórios faltando'}), 400

    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO comentario (id_usuario, id_animal, texto) VALUES (%s, %s, %s)",
            (id_usuario, id_animal, texto)
        )
        conn.commit()
        return jsonify({'mensagem': 'Comentário adicionado com sucesso'}), 201
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@routes.route('/comentarios/<int:id_animal>', methods=['GET'])
def listar_comentarios(id_animal):
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT c.texto, u.nome, c.data_comentario
            FROM Comentario c
            JOIN Usuario u ON c.id_usuario = u.id_usuario
            WHERE c.id_animal = %s
            ORDER BY c.data_comentario DESC
        """, (id_animal,))
        comentarios = cursor.fetchall()
        return jsonify(comentarios), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@routes.route('/favoritar', methods=['POST'])
def favoritar_pet():
    data = request.get_json()
    id_usuario = data.get("id_usuario")
    id_animal = data.get("id_animal")

    try:
        conn = conectar()
        cursor = conn.cursor()

        # Tenta adicionar, se já existir, remove
        cursor.execute(
            "SELECT * FROM favorito WHERE id_usuario = %s AND id_animal = %s", (id_usuario, id_animal))
        existe = cursor.fetchone()

        if existe:
            cursor.execute(
                "DELETE FROM favorito WHERE id_usuario = %s AND id_animal = %s", (id_usuario, id_animal))
            conn.commit()
            return jsonify({"favoritado": False}), 200
        else:
            cursor.execute(
                "INSERT INTO favorito (id_usuario, id_animal) VALUES (%s, %s)", (id_usuario, id_animal))
            conn.commit()
            return jsonify({"favoritado": True}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@routes.route('/favoritos/<int:id_usuario>', methods=['GET'])
def listar_favoritos(id_usuario):
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT a.*
            FROM animal a
            JOIN favorito f ON a.id_animal = f.id_animal
            WHERE f.id_usuario = %s
            ORDER BY a.data_desaparecimento DESC
        """, (id_usuario,))
        favoritos = cursor.fetchall()
        return jsonify(favoritos), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
