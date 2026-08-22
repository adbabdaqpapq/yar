import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// 관리자 ID
const ADMIN_ID = "adbabdaqpapq";


const writeButton =
    document.getElementById("write-button");

const userArea =
    document.getElementById("user-area");


onAuthStateChanged(auth, function(user) {

    if (user) {

        userArea.innerHTML = "";

        const userText =
            document.createElement("span");

        const userId =
            user.email.split("@")[0];

        userText.textContent =
            "로그인: " + userId;


        const logoutButton =
            document.createElement("button");

        logoutButton.textContent =
            "로그아웃";


        logoutButton.addEventListener(
            "click",
            async function() {

                try {

                    await signOut(auth);

                    alert("로그아웃되었습니다.");

                    location.reload();

                } catch (error) {

                    console.error(
                        "로그아웃 오류:",
                        error
                    );

                }

            }
        );


        userArea.appendChild(userText);
        userArea.appendChild(logoutButton);

        writeButton.style.display =
            "inline-block";

    } else {

        userArea.innerHTML = "";

        const loginButton =
            document.createElement("button");

        loginButton.textContent =
            "로그인";


        loginButton.addEventListener(
            "click",
            function() {

                window.location.href =
                    "login.html";

            }
        );


        userArea.appendChild(
            loginButton
        );

        writeButton.style.display =
            "none";

    }

});


writeButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "write.html";

    }
);


async function loadPosts() {

    const postList =
        document.getElementById("post-list");

    postList.innerHTML = "";


    try {

        const querySnapshot =
            await getDocs(
                collection(db, "posts")
            );


        querySnapshot.forEach(
            function(postDoc) {

                const post = {
                    id: postDoc.id,
                    ...postDoc.data()
                };


                // 게시글과 삭제 버튼을 감싸는 영역
                const postWrapper =
                    document.createElement("div");

                postWrapper.className =
                    "post-wrapper";


                // 게시글 테두리
                const postElement =
                    document.createElement("div");

                postElement.className =
                    "post-item";


                // 제목
                const titleElement =
                    document.createElement("h3");

                titleElement.textContent =
                    post.title;

                titleElement.style.cursor =
                    "pointer";


                titleElement.addEventListener(
                    "click",
                    function() {

                        window.location.href =
                            "post.html?id=" +
                            post.id;

                    }
                );


                postElement.appendChild(
                    titleElement
                );


                postWrapper.appendChild(
                    postElement
                );


                // 관리자에게만 삭제 버튼 표시
                const user =
                    auth.currentUser;


                if (user) {

                    const userId =
                        user.email.split("@")[0];


                    if (userId === ADMIN_ID) {

                        const deleteButton =
                            document.createElement(
                                "button"
                            );


                        deleteButton.textContent =
                            "삭제";

                        deleteButton.className =
                            "post-delete-button";


                        deleteButton.addEventListener(
                            "click",
                            async function(event) {

                                event.stopPropagation();


                                const confirmed =
                                    confirm(
                                        "이 게시글과 모든 댓글을 삭제할까요?"
                                    );


                                if (!confirmed) {
                                    return;
                                }


                                try {

                                    // 댓글 삭제
                                    const commentsRef =
                                        collection(
                                            db,
                                            "posts",
                                            post.id,
                                            "comments"
                                        );


                                    const commentsSnapshot =
                                        await getDocs(
                                            commentsRef
                                        );


                                    for (
                                        const commentDoc
                                        of commentsSnapshot.docs
                                    ) {

                                        await deleteDoc(
                                            commentDoc.ref
                                        );

                                    }


                                    // 게시글 삭제
                                    await deleteDoc(
                                        doc(
                                            db,
                                            "posts",
                                            post.id
                                        )
                                    );


                                    postWrapper.remove();


                                } catch (error) {

                                    console.error(
                                        "게시글 삭제 오류:",
                                        error
                                    );


                                    alert(
                                        "게시글 삭제에 실패했습니다."
                                    );

                                }

                            }
                        );


                        postWrapper.appendChild(
                            deleteButton
                        );

                    }

                }


                postList.appendChild(
                    postWrapper
                );

            }
        );


    } catch (error) {

        console.error(
            "게시글 불러오기 오류:",
            error
        );

    }

}


loadPosts();


const searchInput =
    document.getElementById(
        "search-input"
    );

const searchButton =
    document.getElementById(
        "search-button"
    );


searchButton.addEventListener(
    "click",
    function() {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        const postElements =
            document.querySelectorAll(
                ".post-wrapper"
            );


        postElements.forEach(
            function(postWrapper) {

                const title =
                    postWrapper
                        .querySelector("h3")
                        .textContent
                        .toLowerCase();


                if (
                    title.includes(
                        searchText
                    )
                ) {

                    postWrapper.style.display =
                        "block";

                } else {

                    postWrapper.style.display =
                        "none";

                }

            }
        );

    }
);
