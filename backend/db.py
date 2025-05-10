import mysql.connector
from config import MYSQL_CONFIG


def conectar():
    return mysql.connector.connect(**MYSQL_CONFIG)
