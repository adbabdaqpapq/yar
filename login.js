import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const idInput = document.getElementById("user-id");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const guestButton = document.getElementById("guest-button");


function makeFirebaseEmail(userId) {
    return userId.trim().toLowerCase() + "@yar-community.local";
}


// 로그인
loginButton.addEventListener("click", async function() {

    const userId = idInput.value.trim();
    const password = passwordInput.value;

    if (userId === "" || password === "") {
        alert("ID와 비밀번호를 입력해주세요.");
        return;
    }

    try {

        const firebaseEmail = makeFirebaseEmail(userId);

        await signInWithEmailAndPassword(
            auth,
            firebaseEmail,
            password
        );

        alert("로그인되었습니다.");

        window.location.href = "index.html";

    } catch (error) {

        console.error("로그인 오류:", error);

        alert("ID 또는 비밀번호가 올바르지 않습니다.");

    }

});


// 회원가입
signupButton.addEventListener("click", async function() {

    const userId = idInput.value.trim();
    const password = passwordInput.value;

    if (userId === "" || password === "") {
        alert("ID와 비밀번호를 입력해주세요.");
        return;
    }

    if (userId.length < 4) {
        alert("ID는 4자 이상 입력해주세요.");
        return;
    }

    if (password.length < 6) {
        alert("비밀번호는 6자 이상 입력해주세요.");
        return;
    }

    try {

        const firebaseEmail = makeFirebaseEmail(userId);

        await createUserWithEmailAndPassword(
            auth,
            firebaseEmail,
            password
        );

        alert("회원가입이 완료되었습니다.");

        window.location.href = "index.html";

    } catch (error) {

        console.error("회원가입 오류:", error);

        if (error.code === "auth/email-already-in-use") {
            alert("이미 사용 중인 ID입니다.");
        } else {
            alert("회원가입에 실패했습니다.");
        }

    }

});


// 로그인하지 않고 둘러보기
guestButton.addEventListener("click", function() {

    window.location.href = "index.html";

});
