import os
from flask import Flask
from flask_cors import CORS
from routes import routes

app = Flask(__name__)
CORS(app)

# Configura o diretório de uploads
UPLOAD_FOLDER = os.path.join("static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

app.register_blueprint(routes)


if __name__ == '__main__':
    app.run(debug=True)
