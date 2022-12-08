//아이디 입력란에 keyup 이벤트가 일어 났을때 실행할 함수 등록
$(function(){
    $("#id").keyup(function () {
    var id = $(this).val();

    var reg = /^.{2,}$/;
    if (reg.test(id)) {//정규표현식을 통과 한다면
        $("#overlapErr").hide();
        successState("#id");
    } else {//정규표현식을 통과하지 못하면
        $("#overlapErr").show();
        errorState("#id");
    }
    });
});

$(function(){
    $("#name").keyup(function () {
    var id = $(this).val();

    var reg = /^.{2,}$/;
    if (reg.test(id)) {//정규표현식을 통과 한다면
        $("#overErr").hide();
        successState("#name");
    } else {//정규표현식을 통과하지 못하면
        $("#overErr").show();
        errorState("#name");
    }
});
});

$(function(){
    $("#phone").keyup(function () {
    var phone = $(this).val();

    var reg = /^\d{3}-\d{3,4}-\d{4}$/;
    if (reg.test(phone)) {//정규표현식을 통과 한다면
        $("#phoneErr").hide();
        successState("#phone");
    } else {//정규표현식을 통과하지 못하면
        $("#phoneErr").show();
        errorState("#phone");
    }
});
});

$(function(){
    $("#email").keyup(function () {
    var email = $(this).val();

    var reg = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
    if (reg.test(email)) {//정규표현식을 통과 한다면
        $("#emailErr").hide();
        successState("#email");
    } else {//정규표현식을 통과하지 못하면
        $("#emailErr").show();
        errorState("#email");
    }
});
});

$(function(){
    $("#pwd").keyup(function () {
    var pwd = $(this).val();
    // 비밀번호 검증할 정규 표현식
    var reg = /^.{8,}$/;
    if (reg.test(pwd)) {//정규표현식을 통과 한다면
        $("#pwdRegErr").hide();
        successState("#pwd");
    } else {//정규표현식을 통과하지 못하면
        $("#pwdRegErr").show();
        errorState("#pwd");
    }
});
});

$(function(){
    $("#rePwd").keyup(function () {
    var rePwd = $(this).val();
    var pwd = $("#pwd").val();
    // 비밀번호 같은지 확인
    if (rePwd == pwd) {//비밀번호 같다면
        $("#rePwdErr").hide();
        successState("#rePwd");
    } else {//비밀번호 다르다면
        $("#rePwdErr").show();
        errorState("#rePwd");
    }
});
});


// 성공 상태로 바꾸는 함수
function successState(sel) {
    $(sel)
        .removeClass("is-invalid")
        .addClass("is-valid")
};

// 에러 상태로 바꾸는 함수
function errorState(sel) {
    $(sel)
        .removeClass("is-valid")
        .addClass("is-invalid")
};


function saveAccount() {
    let id = $("#id").val()
    let name = $("#name").val()
    let pwd = $("#pwd").val()
    let rePwd = $("#rePwd").val()
    let phone = $("#phone").val()
    let email = $("#email").val()
    let emailReg = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
    let phoneReg = /^\d{3}-\d{3,4}-\d{4}$/;
    // 빈칸일경우 alert 출력

    if (id == "") {
        alert("아이디를 입력해주세요.");
        $("#id").focus();
        return false;
    }

    if (name == "") {
        alert("이름를 입력해주세요.");
        $("#name").focus();
        return false;
    }

    if (pwd == "") {
        alert("패스워드를 입력해주세요.");
        $("#pwd").focus();
        return false;
    }

    if (rePwd == "") {
        alert("패스워드를 확인 입력해주세요.");
        $("#rePwd").focus();
        return false;
    }

    if (phone == "") {
        alert("연락처를 입력해주세요.");
        $("#rePwd").focus();
        return false;
    }

    if (!phoneReg.test(phone)) {
        alert("연락처를 잘못 입력하셨습니다.");
        $("#phone").focus();
        return false;
    }

    if (!emailReg.test(email)) {
        alert("이메일을 잘못 입력하셨습니다.");
        $("#rePwd").focus();
        return false;
    }

    if (pwd != rePwd) {
        alert("비밀번호가 상이합니다");
        $("#pwd").val("");
        $("#rePwd").val("");
        $("#pwd").focus();
        return false;
    }

    let imgUrl = rtanImg()

    $.ajax({
        type: "POST",
        url: "/signUp",
        data: {'id_give': id, 'name_give': name, 'pwd_give': pwd, 'phone_give': phone, 'email_give': email, 'imgUrl_give': imgUrl},
        success: function (response) {
            alert(response["msg"])
            window.location.replace('/')
        }
    })
}

// 르탄이 이미지 가져오기
function rtanImg() {
    let imgUrl
    $.ajax({
        type: "GET",
        url: "http://spartacodingclub.shop/sparta_api/rtan",
        data: {},
        async: false,
        success: function (response) {
            imgUrl = response['url']
        }
    });
    return imgUrl
}