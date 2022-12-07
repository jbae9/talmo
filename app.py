from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re

import pymysql
import json

import certifi
ca = certifi.where()

app = Flask(__name__)


app.secret_key = 'my secret key'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'talmo'

# MySQL 실행
mysql = MySQL(app)

def getDB():
    db = pymysql.connect(host='localhost', user='root', db='talmo', password='password', charset='utf8')
    return db

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
            session['name'] = account['name']
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
   session.pop('name', None)
   return redirect(url_for('login'))


@app.route('/index',)
def index():
    if 'loggedin' in session:
        return render_template('index.html', name=session['name'])
    return redirect(url_for('login'))

@app.route('/')
def home():
   return render_template('index.html')

# 피드 불러오기
@app.route('/feed', methods=["GET"])
def getFeedDB():
    db = getDB()
    curs = db.cursor()

    # feed 테이블에서 feedId, feedDate 불러오기
    # account 테이블이랑 uniqueId로 LEFT JOIN해서 name 불러오기
    # 최신순으로 등록된 데이터을 받음
    sql = """
    SELECT 	feedId,
		date_format(`feedDate`, '%Y-%c-%d %h:%i %p') as feedDate,
		feedComment,
		a.name,
        f.uniqueId
    FROM talmo.feed as f 
    LEFT JOIN talmo.account as a
    ON f.uniqueId = a.uniqueId
    ORDER BY feedDate desc
    """
    uniqueId = session['uniqueId']

    curs.execute(sql)
    rows = curs.fetchall()
    rowsJSON = json.loads(json.dumps(rows, ensure_ascii=False, indent=4, sort_keys=True, default=str))

    db.commit()
    db.close()

    return [uniqueId, rowsJSON]

# 피드 댓글을 DB에 등록하기
@app.route("/feed/post", methods=["POST"])
def saveCommentDB():
    db = getDB()
    curs = db.cursor()

    feedComment = request.form['comment_give']
    feedDate = request.form['date_give']
    uniqueId = session['uniqueId']

    # feed 테이블로 등록
    sql = '''INSERT INTO feed (feedComment, feedDate, uniqueId) values(%s,%s,%s)'''
    curs.execute(sql, (feedComment, feedDate, uniqueId))

    db.commit()
    db.close()
    return jsonify({'msg': '등록 완료!'})


# 피드 댓글을 DB에 삭제하기
@app.route("/feed/<int:feedId>", methods=["DELETE"])
def deleteCommentDB(feedId):
    db = getDB()
    curs = db.cursor()

    feedId = request.form['feedId_give']

    # feed 테이블에 feedId에 해당하는 댓글 삭제
    sql = '''DELETE FROM talmo.feed WHERE feedId = %s'''
    curs.execute(sql, (feedId))

    db.commit()
    db.close()
    return jsonify({'msg': '삭제 완료!'})


# 수정된 댓글을 DB에 업데이트하기
@app.route("/feed/<int:feedId>", methods=["PUT"])
def editCommentDB(feedId):
    db = getDB()
    curs = db.cursor()

    comment = request.form['comment_give']
    date = request.form['date_give']

    # feed 테이블에 feedId에 해당하는 댓글 업데이트
    sql = '''UPDATE talmo.feed SET feedComment = %s, feedDate = %s WHERE feedID = %s;'''
    curs.execute(sql, (comment, date, feedId))

    db.commit()
    db.close()
    return jsonify({'msg': '수정 완료!'})



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
