from flask import Blueprint, request, jsonify
from db import conectar

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
                'id_usuario': usuario['id_usuario'],  # 👈 adicione esta linha
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
        INSERT INTO animal (nome, descricao, especie, genero, raca, porte, cor, endereco, data_desaparecimento, telefone, status, id_usuario)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'perdido', %s)
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
