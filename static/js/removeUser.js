function askRemoveUser() {
    if (confirm("정~말 회원탈퇴 하시겠습니까?")) {
        window.location.href="removeUser"
    } else{
        alert("회원탈퇴를 취소하였습니다.")
    }
}
