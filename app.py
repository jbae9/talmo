from flask import Flask, render_template, request, jsonify, session
app = Flask(__name__)

import pymysql
import json

import certifi
ca = certifi.where()



@app.route('/')
def home():
   return render_template('index.html')

# 피드 불러오기
@app.route('/feed', methods=["GET"])
def getFeedDB():
    db = pymysql.connect(host='localhost', user='root', db='talmo', password='password', charset='utf8')
    curs = db.cursor()

    # feed 테이블에서 feedId, feedDate 불러오기
    # account 테이블이랑 uniqueId로 LEFT JOIN해서 name 불러오기
    # 최신순으로 등록된 데이터을 받음
    # sql = """
    # SELECT feedId, feedDate, a.name FROM feed as f
    # LEFT JOIN account as a
    # ON f.uniqueId = a.uniqueId
    # ORDER BY feedDate
    # """

    sql = """
    SELECT  feedId,
            DATE_FORMAT(`feedDate`, '%Y-%c-%d %h:%i %p') as feedDate,
            feedComment 
    FROM talmo.feed as f 
    ORDER BY feedDate DESC
    """
    
    curs.execute(sql)
    rows = curs.fetchall()
    rowsJSON = json.loads(json.dumps(rows, ensure_ascii=False, indent=4, sort_keys=True, default=str))

    db.commit()
    db.close()

    return rowsJSON


# 피드 댓글을 DB에 등록하기
@app.route("/feed/post", methods=["POST"])
def saveCommentDB():
    db = pymysql.connect(host='localhost', user='root', db='talmo', password='password', charset='utf8')
    curs = db.cursor()

    feedComment = request.form['comment_give']
    feedDate = request.form['date_give']

    # feed 테이블로 등록
    sql = '''insert into feed (feedComment, feedDate) values(%s,%s)'''
    curs.execute(sql, (feedComment, feedDate))

    db.commit()
    db.close()
    return jsonify({'msg': '등록 완료!'})


# 피드 댓글을 DB에 삭제하기
@app.route("/feed", methods=["delete"])
def deleteCommentDB():
    db = pymysql.connect(host='localhost', user='root', db='talmo', password='password', charset='utf8')
    curs = db.cursor()

    feedId = request.form['feedId_give']
    print(feedId)

    # feed 테이블에 feedId에 해당하는 댓글 삭제
    sql = '''DELETE FROM talmo.feed WHERE feedId = %s'''
    curs.execute(sql, (feedId))

    db.commit()
    db.close()
    return jsonify({'msg': '삭제 완료!'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)