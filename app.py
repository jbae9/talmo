from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re

app = Flask(__name__)

app.secret_key = 'your secret key'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'sksms9604'
app.config['MYSQL_DB'] = 'talmo'

# MySQL 실행
mysql = MySQL(app)

# 로그인
@app.route('/', methods=['GET', 'POST'])
def login():
    msg = ''
    if request.method == 'POST' and 'id' in request.form and 'pw' in request.form:
        id = request.form['id']
        pw = request.form['pw']

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM account WHERE id = %s AND pw = %s', (id, pw))
        account = cursor.fetchone()
    
        if account:
            session['loggedin'] = True
            session['uniqueId'] = account['uniqueId']
            session['id'] = account['id']
            return redirect(url_for('index'))
        else:
            msg = '잘못된 아이디/비밀번호 입니다!'
    return render_template('signIn.html', msg=msg)

# 로그아웃
@app.route('/logout')
def logout():
   session.pop('loggedin', None)
   session.pop('uniqueId', None)
   session.pop('id', None)
   return redirect(url_for('login'))


@app.route('/index')
def index():
    if 'loggedin' in session:
        return render_template('index.html', id=session['id'])
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
