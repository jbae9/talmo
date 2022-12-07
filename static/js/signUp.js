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

    if ($("#id").val() == "") {
        alert("아이디 입력바람");
        $("#id").focus();
        return false;
    }


    if ($("#name").val() == "") {
        alert("이름 입력 바람");
        $("#name").focus();
        return false;
    }

    if ($("#pwd").val() == "") {
        alert("패스워드 입력바람");
        $("#pwd").focus();
        return false;
    }

    if ($("#rePwd").val() == "") {
        alert("패스워드 확인바람");
        $("#rePwd").focus();
        return false;
    }

    if ($("#id").val() == $("#pwd").val()) {
        alert("아이디와 비밀번호가 같습니다");
        $("#pwd").val("");
        $("#pwd").focus();
        return false;
    }

    if ($("#pwd").val() != $("#rePwd").val()) {
        alert("비밀번호가 상이합니다");
        $("#pwd").val("");
        $("#rePwd").val("");
        $("#pwd").focus();
        return false;
    }

    $.ajax({
        type: "POST",
        url: "/signUp",
        data: {'id_give': id, 'name_give': name, 'pwd_give': pwd},
        success: function (response) {
            alert(response["msg"])
            window.location.href = "/"
            window.location.reload()
        }
    });

}
