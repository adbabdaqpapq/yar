import { db, auth } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    increment,
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const postDetail =
    document.getElementById(
        "post-detail"
    );


const urlParams =
    new URLSearchParams(
        window.location.search
    );


const postId =
    urlParams.get("id");


// 관리자 ID
const ADMIN_ID =
    "adbabdaqpapq";


async function loadPost() {

    if (!postId) {

        postDetail.innerHTML =
            "<p>게시글을 찾을 수 없습니다.</p>";

        return;
    }


    try {

        const postRef =
            doc(
                db,
                "posts",
                postId
            );


        const postSnapshot =
            await getDoc(
                postRef
            );


        if (!postSnapshot.exists()) {

            postDetail.innerHTML =
                "<p>게시글을 찾을 수 없습니다.</p>";

            return;
        }


        const post =
            postSnapshot.data();


        // =====================================
        // 조회수 처리
        // =====================================

        const viewStorageKey =
            "yar_view_" + postId;


        const lastViewed =
            localStorage.getItem(
                viewStorageKey
            );


        const currentTime =
            Date.now();


        const thirtyMinutes =
            30 * 60 * 1000;


        let currentViews =
            post.views || 0;


        if (
            !lastViewed ||
            currentTime -
            Number(lastViewed)
            >= thirtyMinutes
        ) {

            try {

                await updateDoc(
                    postRef,
                    {
                        views: increment(1)
                    }
                );


                localStorage.setItem(
                    viewStorageKey,
                    currentTime.toString()
                );


                currentViews++;

            } catch (error) {

                console.error(
                    "조회수 증가 오류:",
                    error
                );

            }

        }


        // =====================================
        // 제목
        // =====================================

        const titleElement =
            document.createElement("h2");

        titleElement.textContent =
            post.title;


        // =====================================
        // 작성자
        // =====================================

        const authorElement =
            document.createElement("p");

        authorElement.textContent =
            "작성자: " +
            (
                post.authorNickname ||
                "알 수 없음"
            );


        // =====================================
        // 날짜 및 시간
        // =====================================

        const dateElement =
            document.createElement("p");


        if (post.createdAt) {

            const date =
                post.createdAt.toDate();


            const year =
                date.getFullYear();


            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");


            const day =
                String(
                    date.getDate()
                ).padStart(2, "0");


            const hours =
                String(
                    date.getHours()
                ).padStart(2, "0");


            const minutes =
                String(
                    date.getMinutes()
                ).padStart(2, "0");


            dateElement.textContent =
                `${year}/${month}/${day}-${hours}:${minutes}`;

        } else {

            dateElement.textContent =
                "날짜 정보 없음";

        }


        // =====================================
        // 조회수 표시
        // =====================================

        const viewsElement =
            document.createElement("p");


        viewsElement.textContent =
            "조회수: " +
            currentViews;


        // =====================================
        // 내용
        // =====================================

        const contentElement =
            document.createElement("p");


        contentElement.textContent =
            post.content;


        postDetail.innerHTML = "";


        postDetail.appendChild(
            titleElement
        );


        postDetail.appendChild(
            authorElement
        );


        postDetail.appendChild(
            dateElement
        );


        postDetail.appendChild(
            viewsElement
        );


        postDetail.appendChild(
            contentElement
        );


        // =====================================
        // 댓글 입력 영역
        // =====================================

        const commentInputArea =
            document.createElement("div");

        commentInputArea.className =
            "comment-input-area";


        const commentInput =
            document.createElement("input");

        commentInput.type =
            "text";

        commentInput.placeholder =
            "댓글을 입력하세요.";


        const commentButton =
            document.createElement("button");

        commentButton.textContent =
            "댓글 등록";


        commentInputArea.appendChild(
            commentInput
        );


        commentInputArea.appendChild(
            commentButton
        );


        // =====================================
        // 좋아요 영역
        // =====================================

        const likeArea =
            document.createElement("div");

        likeArea.className =
            "like-area";


        const likeButton =
            document.createElement("button");

        likeButton.textContent =
            "좋아요";


        const likeCount =
            document.createElement("span");

        likeCount.className =
            "like-count";


        likeArea.appendChild(
            likeButton
        );


        likeArea.appendChild(
            likeCount
        );


        // =====================================
        // 좋아요 상태
        // =====================================

        const likeStorageKey =
            "yar_like_" + postId;


        let likeCountValue =
            post.likes || 0;


        let liked =
            localStorage.getItem(
                likeStorageKey
            ) === "true";


        function updateLikeDisplay() {

            likeCount.textContent =
                " " + likeCountValue;


            if (liked) {

                likeButton.textContent =
                    "좋아요 취소";

            } else {

                likeButton.textContent =
                    "좋아요";

            }

        }


        updateLikeDisplay();


        likeButton.addEventListener(
            "click",
            async function() {

                try {

                    if (!liked) {

                        await updateDoc(
                            postRef,
                            {
                                likes:
                                    increment(1)
                            }
                        );


                        likeCountValue++;

                        liked = true;


                        localStorage.setItem(
                            likeStorageKey,
                            "true"
                        );


                    } else {

                        await updateDoc(
                            postRef,
                            {
                                likes:
                                    increment(-1)
                            }
                        );


                        likeCountValue--;

                        liked = false;


                        localStorage.removeItem(
                            likeStorageKey
                        );

                    }


                    updateLikeDisplay();


                } catch (error) {

                    console.error(
                        "좋아요 처리 오류:",
                        error
                    );


                    alert(
                        "좋아요 처리에 실패했습니다."
                    );

                }

            }
        );


        // =====================================
        // 댓글 제목
        // =====================================

        const commentTitle =
            document.createElement("h3");

        commentTitle.textContent =
            "댓글";


        // =====================================
        // 댓글 목록
        // =====================================

        const commentList =
            document.createElement("div");

        commentList.id =
            "comment-list";


        // 입력창 → 좋아요 → 댓글 순서
        postDetail.appendChild(
            commentInputArea
        );


        postDetail.appendChild(
            likeArea
        );


        postDetail.appendChild(
            commentTitle
        );


        postDetail.appendChild(
            commentList
        );


        // =====================================
        // 댓글 등록
        // =====================================

        commentButton.addEventListener(
            "click",
            async function() {

                const commentText =
                    commentInput.value.trim();


                if (
                    commentText === ""
                ) {

                    alert(
                        "댓글을 입력해주세요."
                    );

                    return;
                }


                try {

                    await addDoc(
                        collection(
                            db,
                            "posts",
                            postId,
                            "comments"
                        ),
                        {
                            content:
                                commentText,

                            createdAt:
                                serverTimestamp()
                        }
                    );


                    commentInput.value =
                        "";


                    loadComments();


                } catch (error) {

                    console.error(
                        "댓글 저장 오류:",
                        error
                    );


                    alert(
                        "댓글 등록에 실패했습니다."
                    );

                }

            }
        );


        // =====================================
        // 댓글 불러오기
        // =====================================

        async function loadComments() {

            commentList.innerHTML =
                "";


            try {

                const commentsRef =
                    collection(
                        db,
                        "posts",
                        postId,
                        "comments"
                    );


                const commentsQuery =
                    query(
                        commentsRef,
                        orderBy(
                            "createdAt",
                            "asc"
                        )
                    );


                const commentsSnapshot =
                    await getDocs(
                        commentsQuery
                    );


                commentsSnapshot.forEach(
                    function(commentDoc) {

                        const comment =
                            commentDoc.data();


                        const commentElement =
                            document.createElement(
                                "div"
                            );


                        const commentText =
                            document.createElement(
                                "span"
                            );


                        commentText.textContent =
                            comment.content;


                        commentElement.appendChild(
                            commentText
                        );


                        // 관리자에게만 댓글 삭제 버튼 표시
                        const user =
                            auth.currentUser;


                        if (user) {

                            const userId =
                                user.email.split("@")[0];


                            if (
                                userId === ADMIN_ID
                            ) {

                                const deleteCommentButton =
                                    document.createElement(
                                        "button"
                                    );


                                deleteCommentButton.textContent =
                                    "삭제";


                                deleteCommentButton.addEventListener(
                                    "click",
                                    async function() {

                                        const confirmed =
                                            confirm(
                                                "이 댓글을 삭제할까요?"
                                            );


                                        if (!confirmed) {

                                            return;

                                        }


                                        try {

                                            await deleteDoc(
                                                commentDoc.ref
                                            );


                                            loadComments();


                                        } catch (error) {

                                            console.error(
                                                "댓글 삭제 오류:",
                                                error
                                            );


                                            alert(
                                                "댓글 삭제에 실패했습니다."
                                            );

                                        }

                                    }
                                );


                                commentElement.appendChild(
                                    deleteCommentButton
                                );

                            }

                        }


                        commentList.appendChild(
                            commentElement
                        );

                    }
                );


            } catch (error) {

                console.error(
                    "댓글 불러오기 오류:",
                    error
                );

            }

        }


        loadComments();


    } catch (error) {

        console.error(
            "게시글 불러오기 오류:",
            error
        );


        postDetail.innerHTML =
            "<p>게시글을 불러오는 중 오류가 발생했습니다.</p>";

    }

}


loadPost();
