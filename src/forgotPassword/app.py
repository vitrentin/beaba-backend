import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import secrets
import string

def generate_token(length=32):
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

app = Flask(__name__)
CORS(app)
@app.route('/api/reset-password', methods=['POST'])
@cross_origin() 
def reset_password():
    data = request.get_json()
    email = data.get('email')
    token = generate_token()
    link_reset_senha = f"http://localhost:5173/reset-password?token={token}&email={email}"

    enviar_email(email, link_reset_senha)

    return jsonify({"message": "Email de redefinição de senha enviado com sucesso"}), 200

def enviar_email(destinatario, link_reset_senha):
    corpo_email = f"""
    <p>Você solicitou a redefinição da sua senha.</p>
    <p>Para redefinir sua senha, clique no link abaixo:</p>
    <p><a href="{link_reset_senha}">{link_reset_senha}</a></p>
    """

    msg = MIMEMultipart()
    msg['Subject'] = "Redefinição de Senha"
    msg['From'] = 'beabatrentin@gmail.com'  
    msg['To'] = destinatario

    msg.attach(MIMEText(corpo_email, 'html'))

    password = 'nqgulccmbyasojwh' 

    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()

    try:
        s.login(msg['From'], password)

        s.sendmail(msg['From'], [msg['To']], msg.as_string())
        print('Email enviado com sucesso')

    except Exception as e:
        print(f'Erro ao enviar email: {str(e)}')

    finally:
        s.quit()

if __name__ == '__main__':
    app.run(debug=True)