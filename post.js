import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const postDetail = document.getElementById("post-detail");

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");


async function loadPost() {

    if (!postId) {
        postDetail.innerHTML = "<p>게시글을 찾을 수 없습니다.</p>";
        return;
    }

    try {

        const postRef = doc(db, "posts", postId);
        const postSnapshot = await getDoc(postRef);

        if (!postSnapshot.exists()) {
            postDetail.innerHTML = "<p>게시글을 찾을 수 없습니다.</p>";
            return;
        }

        const post = postSnapshot.data();


        const titleElement = document.createElement("h2");
        titleElement.textContent = post.title;


        const contentElement = document.createElement("p");
        contentElement.textContent = post.content;


        postDetail.innerHTML = "";

        postDetail.appendChild(titleElement);
        postDetail.appendChild(contentElement);


        const commentTitle = document.createElement("h3");
        commentTitle.textContent = "댓글";

        postDetail.appendChild(commentTitle);


        const commentList = document.createElement("div");
        commentList.id = "comment-list";

        postDetail.appendChild(commentList);


        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "댓글을 입력하세요.";

        postDetail.appendChild(commentInput);


        const commentButton = document.createElement("button");
        commentButton.textContent = "댓글 등록";

        postDetail.appendChild(commentButton);


        commentButton.addEventListener("click", async function() {

            const commentText = commentInput.value.trim();

            if (commentText === "") {
                alert("댓글을 입력해주세요.");
                return;
            }


            try {

                await addDoc(
                    collection(db, "posts", postId, "comments"),
                    {
                        content: commentText,
                        createdAt: serverTimestamp()
                    }
                );

                commentInput.value = "";

                loadComments();

            } catch (error) {

                console.error("댓글 저장 오류:", error);

                alert("댓글 등록에 실패했습니다.");
            }

        });


        async function loadComments() {

            commentList.innerHTML = "";

            try {

                const commentsRef = collection(
                    db,
                    "posts",
                    postId,
                    "comments"
                );

                const commentsQuery = query(
                    commentsRef,
                    orderBy("createdAt", "asc")
                );

                const commentsSnapshot = await getDocs(commentsQuery);


                commentsSnapshot.forEach(function(commentDoc) {

                    const comment = commentDoc.data();

                    const commentElement = document.createElement("p");

                    commentElement.textContent = comment.content;

                    commentList.appendChild(commentElement);

                });

            } catch (error) {

                console.error("댓글 불러오기 오류:", error);

            }

        }


        loadComments();

    } catch (error) {

        console.error("게시글 불러오기 오류:", error);

        postDetail.innerHTML =
            "<p>게시글을 불러오는 중 오류가 발생했습니다.</p>";
    }
}


loadPost();
