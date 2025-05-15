from flask import Blueprint, request, jsonify
from db import conectar
import os
from werkzeug.utils import secure_filename
from flask import current_app

routes = Blueprint('routes', __name__)


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
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'perdido', %s)
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
        cursor.execute(
            "SELECT nome, status, foto, endereco, data_desaparecimento FROM animal ORDER BY data_desaparecimento DESC")
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
    pasta_uploads = os.path.join(current_app.root_path, 'static', 'uploads')
    os.makedirs(pasta_uploads, exist_ok=True)  # Garante que a pasta exista

    caminho = os.path.join(pasta_uploads, filename)
    file.save(caminho)

    # Retorna o caminho relativo para uso no front
    return jsonify({'caminho': f'/static/uploads/{filename}'}), 200
