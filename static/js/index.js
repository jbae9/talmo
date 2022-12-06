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
                let feedId = rows[i][0]
                let date = rows[i][1]
                let comment = rows[i][2]
                let name = rows[i][3]
                
                // div id가 숫자로만 구성될 수 없으니 feedId# 으로 수정
                let divFeedId = 'feedId' + feedId
                let divFeedCommentId = 'feedCommentId' + feedId

                // 받은 정보를 HTML로 전환
                let temp_html = `  <a href="#" class="list-group-item list-group-item-action" id="${divFeedId}">
                                        <div class="d-flex w-100 justify-content-between">
                                            <h5 class="mb-1">${name}</h5>
                                        </div>
                                        <small class="text-muted">${date}</small>
                                        <div>
                                            <p class="mb-1" id="${divFeedCommentId}">${comment}</p>
                                            <div id='divEdit${feedId}' style='display: none'>
                                                <textarea class='form-control' id='editCommment${feedId}' style='height: 80px' placeholder='수정할 내용을 입력해주세요'></textarea>
                                                <button class='btn btn-primary' style='margin-top:5px' onclick='editComment(${feedId})'>확인</button>
                                                <button class='btn btn-danger' style='margin-top:5px' onclick="cancelEdit('${feedId}')">취소</button>
                                            </div>
                                        </div>
                                        <button type="button" class="btn btn-danger" style="float:right" onclick="deleteComment(${feedId})">삭제</button>
                                        <button type="button" class="btn btn-success" style="float:right; margin-right:5px" onclick="showInputEdit('${feedId}')">수정</button>
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
        ('00' + (date.getMonth()+1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' + 
        ('00' + date.getHours()).slice(-2) + ':' + 
        ('00' + date.getMinutes()).slice(-2) + ':' + 
        ('00' + date.getSeconds()).slice(-2)

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
        url: '/feed/' + feedId,
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
function showInputEdit(feedId){
    let divId = 'divEdit' + feedId
    let div = document.getElementById(divId)
    if (div.style.display === 'none') {
        div.style.display = "block"
    }
}

// 수정 취소할 때 textarea 숨기기
function cancelEdit(feedId){
    let divId = 'divEdit' + feedId
    let div = document.getElementById(divId)
    if (div.style.display === 'block') {
        div.style.display = 'none'
    }
}


// 피드 댓글 수정
function editComment(feedId){
    // div Id는 'feedId' + feedId숫자
    let divId = 'feedId' + feedId

    const editTextAreaId = 'editCommment' + feedId

    
    let comment = document.getElementById(editTextAreaId).value
    let date = new Date()
    
    // MySQL의 DATETIME 포맷으로 수정: 'YYYY-MM-DD hh:mm:ss'
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getMonth()+1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' + 
        ('00' + date.getHours()).slice(-2) + ':' + 
        ('00' + date.getMinutes()).slice(-2) + ':' + 
        ('00' + date.getSeconds()).slice(-2)

    console.log(date)
    
    $.ajax({
        type: 'PUT',
        url: '/feed/' + feedId,
        data: {
                feedId_give: feedId,
                comment_give: comment,
                date_give: date
            },
        success: function (response) {
            alert(response['msg'])
            document.getElementById(divId).innerHTML = ``
            window.location.reload()
        }
    });
}
