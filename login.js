import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const guestButton = document.getElementById("guest-button");


// 로그인
loginButton.addEventListener("click", async function () {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (email === "" || password === "") {
        alert("이메일과 비밀번호를 입력해주세요.");
        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("로그인되었습니다.");

        window.location.href = "index.html";

    } catch (error) {

        console.error("로그인 오류:", error);

        alert("로그인에 실패했습니다.\n이메일 또는 비밀번호를 확인해주세요.");

    }

});


// 회원가입
signupButton.addEventListener("click", async function () {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (email === "" || password === "") {
        alert("이메일과 비밀번호를 입력해주세요.");
        return;
    }

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("회원가입이 완료되었습니다.");

        window.location.href = "index.html";

    } catch (error) {

        console.error("회원가입 오류:", error);

        alert("회원가입에 실패했습니다.");

    }

});


// 로그인하지 않고 둘러보기
guestButton.addEventListener("click", function () {

    window.location.href = "index.html";

});
