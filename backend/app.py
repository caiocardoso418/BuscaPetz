import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from routes import routes

# Caminho absoluto da pasta onde estão os uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'uploads')

app = Flask(__name__, static_folder="../", static_url_path="/")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

# Rota para arquivos HTML, CSS e JS externos


@app.route('/<path:filename>')
def servir_arquivos_estaticos(filename):
    return send_from_directory('../', filename)

# Rota específica para servir imagens da pasta static/uploads


@app.route('/static/uploads/<path:filename>')
def servir_uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# Registrar as rotas da API
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True)
