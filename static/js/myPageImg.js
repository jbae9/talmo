$(document).ready(function () {
    // myPage.html이 로딩 되었으면 이미지 불러오기
    getMyImg();
})

function getMyImg(){
    $.ajax({
        type: 'GET',
        url: '/myImg',
        data: {},
        success: function (response) {
            
        }
    })
}