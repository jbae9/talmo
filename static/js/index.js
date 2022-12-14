
$(document).ready(function () {
    // index.html이 로딩 되었으면 피드 불러오기
    getFeed(1);
})


//  페이지 시작, 새로고침 시 작동 --------------------
$(document).ready(() => {
    let pagenumber = localStorage.getItem('pagenumber')
    if (!pagenumber) {
        getFeed(1)
    } else {
        getFeed(parseInt(pagenumber))
    }
    document.getElementById('page-1').addEventListener('click', () => {
        console.log('yes')
        localStorage.setItem('pagenumber', 1)
        getFeed(1)
    })


    document.getElementById('page-2').addEventListener('click', () => {
        console.log('yes')
        localStorage.setItem('pagenumber', 2)
        getFeed(2)
    })

    document.getElementById('page-3').addEventListener('click', () => {
        console.log('yes')
        localStorage.setItem('pagenumber', 3)
        getFeed(3)
    })
    // $('#page-1').on('click', () => {
    //     console.log('1click')
    //     localStorage.setItem('pagenumber', 1)
    //     getFeed(1)
    // })
    // $('#page-2').on('click', () => {
    //     console.log('2click')
    //     localStorage.setItem('pagenumber', 2)
    //     getFeed(2)
    // })
    // $('#page-3').on('click', () => {
    //
    //     localStorage.setItem('pagenumber', 3)
    //     getFeed(3)
    // })
})
// ---------------------------------------------
// 피드 불러오기
function getFeed(parameter) {
    console.log(parameter)
    $.ajax({
        type: 'GET',
        url: `/feed/${parameter}`,
        data: {},
        success: function (response) {
            let rows = response[1]
            const myUniqueId = response[0]

            $('#feedList').empty()
            console.log(response)
            for (let i = 0; i < rows.length; i++) {
                let feedId = rows[i][0]
                let date = rows[i][1]
                let comment = rows[i][2]
                let name = rows[i][3]
                let uniqueId = rows[i][4]
                let imgSrc = rows[i][5]

                // div id가 숫자로만 구성될 수 없으니 feedId# 으로 수정
                let divFeedId = 'feedId' + feedId
                let divFeedCommentId = 'feedCommentId' + feedId
                let temp_html = ``
                // 로그인된 유저와 피드 댓글에 등록된 uniqueId가 같으면
                // 수정/삭제 버튼 보이기
                if (myUniqueId === uniqueId) {
                    // 받은 정보를 HTML로 전환
                    temp_html = `<div class="list-group mt-2 position-relative" id="${divFeedId}">
                        <a href="#" class="list-group-item">
                            <div class="w-100">
                                <div><img height="50" style='float: left'
                                          src="data:image/png;base64,${imgSrc}"></div>
                                <h5 class="mb-1">${name}</h5>
                                <small class="text-muted">${date}</small>
                            </div>
                            <p class="mb-1" id="${divFeedCommentId}">${comment}</p>
                            <div id='divEdit${feedId}' style='display: none'>
                                <textarea class='form-control' id='editCommment${feedId}' style='height: 80px' placeholder='수정할 내용을 입력해주세요'></textarea>
                                <button class='btn btn-outline-warning' style='margin-top:5px' onclick='editComment(${feedId})'>확인</button>
                                <button class='btn btn-outline-danger' style='margin-top:5px' onclick="cancelEdit('${feedId}')">취소</button>
                            </div>
                        </a>
                        <div class="dropdown position-absolute top-0 end-0">
                            <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                •••
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a class="dropdown-item" href="#" onclick="deleteComment(${feedId})">삭제</a></li>
                                <li><a class="dropdown-item" href="#" onclick="showInputEdit('${feedId}')">수정</a></li>
                            </ul>
                        </div>
                    </div>`
                } else {
                    temp_html = `
                    <div class="list-group mt-2 position-relative" id="${divFeedId}">
                        <a href="#" class="list-group-item">
                            <div class="w-100">
                                <div><img height="50" style='float: left'
                                          src="data:image/png;base64,${imgSrc}"></div>
                                <h5 class="mb-1">${name}</h5>
                                <small class="text-muted">${date}</small>
                            </div>
                            <p class="mb-1" id="${divFeedCommentId}">${comment}</p>
                        </a>
                    </div>`
                }
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

    // MySQL의 DATETIME 포맷으로 수정: 'YYYY-MM-DD hh:mm:ss'
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
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
function deleteComment(feedId) {
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
function showInputEdit(feedId) {
    let divId = 'divEdit' + feedId
    let div = document.getElementById(divId)
    if (div.style.display === 'none') {
        div.style.display = "block"
    }
}

// 수정 취소할 때 textarea 숨기기
function cancelEdit(feedId) {
    let divId = 'divEdit' + feedId
    let div = document.getElementById(divId)
    if (div.style.display === 'block') {
        div.style.display = 'none'
    }
}


// 피드 댓글 수정
function editComment(feedId) {
    // div Id는 'feedId' + feedId숫자
    let divId = 'feedId' + feedId

    const editTextAreaId = 'editCommment' + feedId


    let comment = document.getElementById(editTextAreaId).value
    let date = new Date()

    // MySQL의 DATETIME 포맷으로 수정: 'YYYY-MM-DD hh:mm:ss'
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
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


// ----------- 날씨 API -------------

// 문서가 준비됐을 때 위치 불러오기
$(document).ready(
    function getLocation() {
        const x = document.getElementById('divWeather')
        let temp_html = ``
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, function (error) {
                if (error.code == error.PERMISSION_DENIED)
                    temp_html = '<p class="text-center">위치 권한이 없습니다 :(<br>현재 날씨를 보고 싶으면 위치 권한을 승인해주세요!</p>'
                x.innerHTML = temp_html;
            });
        } else {
            x.innerHTML = "이 브라우저에는 Geolocation 사용 불가입니다.";
        }
    }
);

function showPosition(position) {
    const x = document.getElementById('divWeather')
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    openWeather(position.coords.latitude, position.coords.longitude)
}

function openWeather(lat, lon) {
    $.ajax({
        type: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2545f86b909c0f5a5f7d198c9abf1a67&lang=kr&units=metric`,
        data: {},
        success: function (response) {
            const x = document.getElementById('divWeather')

            const weatherIconId = response['weather'][0]['icon']

            const weatherDescription = response['weather'][0]['description']
            const weatherTemp = response['main']['temp']
            const weatherFeelsLike = response['main']['feels_like']
            const weatherTempMin = response['main']['temp_min']
            const weatherTempMax = response['main']['temp_max']

            const city = response['name']
            const country = response['sys']['country']

            let temp_html = `<p class="text-center" style="margin-bottom:0">현재 위치: ${city}, ${country}</p>
                            <p class="text-muted text-center" style="font-size:small; margin-bottom:0">PC로 접속하면 실제 계신 위치와 차이가 발생할 수 있습니다.</p>
                            <div class="justify-content-center" style="display:flex">
                            <img style="position:relative" src="http://openweathermap.org/img/wn/${weatherIconId}@2x.png">
                            <div style="position:relative; padding-top: 20px">
                                <h3>${weatherTemp}°C</h3>
                                <p style="font-size:16px">${weatherDescription}</p>
                            </div>
                            </div>
                            <p class="text-center">
                            체감 온도: ${weatherFeelsLike}°C<br>
                            최저 기온: ${weatherTempMin}°C<br>
                            최고 기온: ${weatherTempMax}°C
                            </p>`

            x.innerHTML = temp_html
        }
    })
}