import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const postButton = document.getElementById("post-button");

postButton.addEventListener("click", async function() {
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;

    if (title.trim() === "" || content.trim() === "") {
        alert("제목과 내용을 입력해주세요.");
        return;
    }

    try {
        await addDoc(collection(db, "posts"), {
            title: title,
            content: content,
            createdAt: serverTimestamp(),
            comments: []
        });

        alert("게시글이 등록되었습니다.");

        window.location.href = "index.html";
    } catch (error) {
        console.error("게시글 저장 오류:", error);
        alert("게시글 등록에 실패했습니다.");
    }
});
