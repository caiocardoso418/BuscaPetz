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
                'email': usuario['email'],
                'nome': usuario['nome']  # <== AQUI pega o nome real
            }), 200
        else:
            return jsonify({'erro': 'Credenciais inválidas'}), 401
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
