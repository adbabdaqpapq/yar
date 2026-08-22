import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const writeButton = document.getElementById("write-button");

writeButton.addEventListener("click", function() {
    window.location.href = "write.html";
});


async function loadPosts() {
    const postList = document.getElementById("post-list");

    try {
        const querySnapshot = await getDocs(collection(db, "posts"));

        querySnapshot.forEach(function(doc) {
            const post = {
                id: doc.id,
                ...doc.data()
            };

            const postElement = document.createElement("div");


            const titleElement = document.createElement("h3");
            titleElement.textContent = post.title;

            titleElement.style.cursor = "pointer";

            titleElement.addEventListener("click", function() {
                window.location.href = "post.html?id=" + post.id;
            });


            const contentElement = document.createElement("p");
            contentElement.textContent = post.content;


            postElement.appendChild(titleElement);
            postElement.appendChild(contentElement);

            postList.appendChild(postElement);
        });

    } catch (error) {
        console.error("게시글 불러오기 오류:", error);
    }
}


loadPosts();


const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", function() {
    const searchText = searchInput.value.toLowerCase();

    const postElements = document.querySelectorAll("#post-list > div");

    postElements.forEach(function(postElement) {
        const title = postElement.querySelector("h3").textContent.toLowerCase();

        if (title.includes(searchText)) {
            postElement.style.display = "block";
        } else {
            postElement.style.display = "none";
        }
    });
});
