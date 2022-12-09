from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import mysql.connector
import bcrypt
import re
import pymysql
import json

from urllib.request import urlopen
import base64

import certifi

ca = certifi.where()

app = Flask(__name__)

app.secret_key = 'my secret key'

def getDB():
    db = pymysql.connect(host='localhost', user='root', db='talmo', password='sksms9604', charset='utf8')
    return db


# 로그인
@app.route('/', methods=['GET', 'POST'])
def login():
    db = getDB()
    curs = db.cursor()

    msg = ''
    if request.method == 'POST' and 'id' in request.form and 'pw' in request.form:
        id = request.form['id']
        pw = request.form['pw']
        curs.execute('SELECT * FROM account WHERE id = %s', [id])
        account = curs.fetchone()
        pw9 = bcrypt.checkpw(pw.encode('utf-8'), account[2].encode('utf-8'))

        if (account) and (pw9 == True):
            session['loggedin'] = True
            session['uniqueId'] = account[0]
            session['id'] = account[1]
            session['name'] = account[3]
            return redirect(url_for('index'))
        else:
            msg = '잘못된 아이디/비밀번호 입니다!'
    return render_template('login.html', msg=msg)


# 로그아웃
@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('uniqueId', None)
    session.pop('id', None)
    session.pop('name', None)
    return redirect(url_for('login'))


# 로그인 됬을 때 메인페이지로 이동 id=session['id']
@app.route('/index')
def index():
    db = getDB()
    curs = db.cursor()
    if 'loggedin' in session:
        curs.execute('SELECT * FROM account WHERE id = %s', (session['id'],))
        account = curs.fetchone()
        return render_template('index.html', account=account)
    return redirect(url_for('login'))


# 홈 눌렀을 때 [메인] 페이지 이동
@app.route('/')
def home():
    return render_template('index.html')


# register 눌렀을 때 [회원가입] 페이지 이동
@app.route('/signUp')
def signUp():
    return render_template('signUp.html')


# 회원정보 수정 눌렀을 때 [회원정보 수정] 페이지 이동
@app.route('/editAccount')
def edit():
    db = getDB()
    curs = db.cursor()
    if 'loggedin' in session:
        curs.execute('SELECT * FROM account WHERE id = %s', (session['id'],))
        account = curs.fetchone()
        return render_template('editAccount.html', account=account)
    return redirect(url_for('login'))


# 마이페이지
@app.route('/mypage')
def mypage():
    db = getDB()
    curs = db.cursor()
    if 'loggedin' in session:
        curs.execute('SELECT * FROM account WHERE id = %s', (session['id'],))
        account = curs.fetchone()
        return render_template('myPage.html', account=account)
    return redirect(url_for('login'))


# 회원정보 수정
@app.route('/editAccount', methods=['GET', 'POST'])
def editAccount():
    db = getDB()
    curs = db.cursor()
    if request.method == 'POST' and 'name' in request.form and 'phone' in request.form and 'email' in request.form:
        name = request.form['name']
        phone = request.form['phone']
        email = request.form['email']

        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            msg = '⚠경고: 이메일 형식이 잘못되었습니다.'
            account = curs.fetchone()
            return render_template('editAccount.html', msg=msg, account=account)
        
        elif not re.match(r'^010|011|070-\d{3,4}-\d{4}$', phone):
            msg = '⚠경고: 휴대폰 번호 형식이 잘못되었습니다.'
            curs.execute('SELECT * FROM account WHERE id = %s', (session['id'],))
            account = curs.fetchone()
            return render_template('editAccount.html', msg=msg, account=account)
        
        else:
            curs.execute('UPDATE account SET name = %s, phone = %s, email = %s WHERE id = %s', (name, phone, email, session['id'],))
            db.commit()
            return redirect(url_for('mypage'))


# 회원탈퇴
@app.route('/removeUser')
def removeUser():
    db = getDB()
    curs = db.cursor()
    if 'loggedin' in session:
        curs.execute('DELETE FROM account WHERE id = %s', (session['id'],))
        db.commit()
        db.close()
    return redirect(url_for('login'))


# 피드 불러오기
@app.route('/feed/<int:page_id>', methods=["GET"])
def getFeedDB(page_id):
    db = getDB()
    curs = db.cursor()
    if page_id == 1:
        sql = '''SELECT feedId,
                    date_format(`feedDate`, '%Y-%c-%d %h:%i %p') as feedDate,
                    feedComment,
                    a.name,
                    f.uniqueId,
                    a.img
                FROM talmo.feed as f
                LEFT JOIN talmo.account as a
                ON f.uniqueId = a.uniqueId
                ORDER BY feedDate desc
                LIMIT 5 OFFSET 0'''
    if page_id == 2:
        sql = '''SELECT feedId,
                    date_format(`feedDate`, '%Y-%c-%d %h:%i %p') as feedDate,
                    feedComment,
                    a.name,
                    f.uniqueId,
                    a.img
                FROM talmo.feed as f
                LEFT JOIN talmo.account as a
                ON f.uniqueId = a.uniqueId
                ORDER BY feedDate desc
                LIMIT 5 OFFSET 5'''
    if page_id == 3:
        sql = '''SELECT feedId,
                    date_format(`feedDate`, '%Y-%c-%d %h:%i %p') as feedDate,
                    feedComment,
                    a.name,
                    f.uniqueId,
                    a.img
                FROM talmo.feed as f
                LEFT JOIN talmo.account as a
                ON f.uniqueId = a.uniqueId
                ORDER BY feedDate desc
                LIMIT 5 OFFSET 10'''
    # feed 테이블에서 feedId, feedDate 불러오기
    # account 테이블이랑 uniqueId로 LEFT JOIN해서 name 불러오기
    # 최신순으로 등록된 데이터을 받음
    # sql = """
    # SELECT 	feedId,
    # 	date_format(`feedDate`, '%Y-%c-%d %h:%i %p') as feedDate,
    # 	feedComment,
    # 	a.name,
    #     f.uniqueId
    # FROM talmo.feed as f
    # LEFT JOIN talmo.account as a
    # ON f.uniqueId = a.uniqueId
    # ORDER BY feedDate desc
    # """
    uniqueId = session['uniqueId']
    curs.execute(sql)
    rows = curs.fetchall()

    newRows = [0] * len(rows)
    for i in range(len(rows)):
        newRows[i] = [0] * 6
        newRows[i][0] = rows[i][0]
        newRows[i][1] = rows[i][1]
        newRows[i][2] = rows[i][2]
        newRows[i][3] = rows[i][3]
        newRows[i][4] = rows[i][4]
        if rows[i][5] != None:
            b64 = base64.b64encode(rows[i][5]).decode('utf-8')
            newRows[i][5] = b64
        else:
            newRows[i][5] = rows[i][5]

    db.commit()
    db.close()
    return [uniqueId, newRows]


# 프로필 사진 마이페이지에 불러오기
@app.route('/myImg', methods=["GET"])
def getProfileImg():
    db = getDB()
    curs = db.cursor()

    sql = """SELECT img FROM talmo.account WHERE uniqueId = %s"""

    uniqueId = session['uniqueId']
    curs.execute(sql, (uniqueId))
    row = curs.fetchone()

    binary = row[0]
    b64 = base64.b64encode(binary).decode('utf-8')

    db.commit()
    db.close()

    return b64


# 피드 댓글을 DB에 등록하기
@app.route('/feed/post', methods=["POST"])
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


# 회원가입
@app.route("/signUp", methods=["POST"])
def Account():
    db = getDB()
    curs = db.cursor()

    id = request.form['id_give']
    pwd = request.form['pwd_give']
    pw1 = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt())
    name = request.form['name_give']
    phone = request.form['phone_give']
    email = request.form['email_give']

    imgUrl = request.form['imgUrl_give']
    imgBinary = urlopen(imgUrl).read()

    sql = '''insert into account (id, pw, name, phone, email, img) values(%s,%s,%s,%s,%s,%s)'''
    curs.execute(sql, (id, pw1, name, phone, email, imgBinary))

    db.commit()
    db.close()
    return jsonify({'msg': '기록 완료!'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
