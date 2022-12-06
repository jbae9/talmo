$(document).ready(function () {
    // index.html이 로딩 되었으면 피드 불러오기
    getFeed();
})


// 피드 불러오기
function getFeed() {
    $.ajax({
        type: 'GET',
        url: '/feed',
        data: {},
        success: function (response) {
            let rows = response

            for (let i = 0; i < rows.length; i++) {
                // let name = rows[i]['name']
                // let comment = rows[i]['feedComment']
                // let date = rows[i]['feedDate']
                // let feedIdTemp = rows[i]['feedId']

                let feedId = rows[i][0]
                let date = rows[i][1]
                let comment = rows[i][2]
                
                // div id가 숫자로만 구성될 수 없으니 feedId# 으로 수정
                let divFeedId = 'feedId' + feedId
                let divFeedCommentId = 'feedCommentId' + feedId

                // 받은 정보를 HTML로 전환
                // let temp_html = `<a href="#" class="list-group-item list-group-item-action" id="${feedId}">
                //                     <div class="d-flex w-100 justify-content-between">
                //                     <h5 class="mb-1">${name}</h5>
                //                     <small class="text-muted">${date}</small>
                //                     </div>
                //                     <p class="mb-1">${comment}</p>
                //                     <button type="button" class="btn btn-danger" style="float:right" onclick="deleteComment()">삭제</button>
                //                     <button type="button" class="btn btn-success" style="float:right; margin-right:5px" onclick="editComment()">수정</button>
                //                 </a>`

                let temp_html = `<a href="#" class="list-group-item list-group-item-action" id="${divFeedId}">
                                    <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">Name</h5>
                                    <small class="text-muted">${date}</small>
                                    </div>
                                    <div>
                                    <p class="mb-1" id="${divFeedCommentId}">${comment}</p>
                                    </div>
                                    <button type="button" class="btn btn-danger" style="float:right" onclick="deleteComment(${feedId})">삭제</button>
                                    <button type="button" class="btn btn-success" style="float:right; margin-right:5px" onclick="showInputEdit(${divFeedCommentId},${comment})">수정</button>
                                </a>`

                $('#feedList').append(temp_html)
            }
        }
    });
}


// 피드 댓글 저장하기
function saveComment() {
    let comment = $('#inputComment').val()
    let date = new Date()
    // 로그인된 유저의 uniqueId 받아와야함
    // let uid = 
    
    // MySQL의 DATETIME 포맷으로 수정: 'YYYY-MM-DD hh:mm:ss'
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2)

    $.ajax({
        type: 'POST',
        url: '/feed/post',
        data: {
                comment_give: comment,
                date_give: date
            },
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}


// 피드 댓글 삭제
function deleteComment(feedId){
    // div Id는 'feedId' + feedId숫자
    let divId = 'feedId' + feedId

    $.ajax({
        type: 'DELETE',
        // url 수정 필요 `/feed/${feedId}`
        url: '/feed',
        data: {
                feedId_give: feedId
            },
        success: function (response) {
            alert(response['msg'])
            document.getElementById(divId).innerHTML = ``
            window.location.reload()
        }
    });
}

// 수정 버튼 눌렀을 때 입력칸 보여줌
function showInputEdit(divFeedCommentId){
    console.log(divFeedCommentId)
    console.log(divFeedCommentId.innerHTML)
    const oldComment = divFeedCommentId.innerHTML
       
    let txtarea = document.createElement('textarea')
    txtarea.className = 'form-control'
    txtarea.id = 'editComment'
    txtarea.style = 'height: 50px'
    txtarea.innerHTML = oldComment + '<br>'
    
    divFeedCommentId.parentNode.replaceChild(txtarea, divFeedCommentId);

}

// 피드 댓글 수정
function editComment(feedId){
    // div Id는 'feedId' + feedId숫자
    let divId = 'feedId' + feedId

    let comment = $('#inputComment').val()
    let date = new Date()
    // 로그인된 유저의 uniqueId 받아와야함
    // let uid = 
    
    // MySQL의 DATETIME 포맷으로 수정: 'YYYY-MM-DD hh:mm:ss'
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2)

    
    $.ajax({
        type: 'PUT',
        // url 수정 필요 `/feed/${feedId}`
        url: '/feed',
        data: {
                feedId_give: feedId
            },
        success: function (response) {
            alert(response['msg'])
            document.getElementById(divId).innerHTML = ``
            window.location.reload()
        }
    });
}
