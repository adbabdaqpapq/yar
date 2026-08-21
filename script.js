const writeButton = document.getElementById("write-button");

writeButton.addEventListener("click", function() {
    window.location.href = "write.html";
});


const savedPosts = localStorage.getItem("posts");

if (savedPosts !== null) {
    const posts = JSON.parse(savedPosts);

    const postList = document.getElementById("post-list");

    posts.forEach(function(post) {
        const postElement = document.createElement("div");


        const titleElement = document.createElement("h3");
        titleElement.textContent = post.title;

        titleElement.style.cursor = "pointer";

        titleElement.addEventListener("click", function() {
            window.location.href = "post.html?id=" + post.id;
        });


        const contentElement = document.createElement("p");
        contentElement.textContent = post.content;


        const editButton = document.createElement("button");
        editButton.textContent = "수정";

        editButton.addEventListener("click", function() {
            const newTitle = prompt("새 제목을 입력하세요.", post.title);
            const newContent = prompt("새 내용을 입력하세요.", post.content);

            if (newTitle === null || newContent === null) {
                return;
            }

            if (newTitle === "" || newContent === "") {
                alert("제목과 내용을 모두 입력해주세요.");
                return;
            }

            post.title = newTitle;
            post.content = newContent;

            localStorage.setItem("posts", JSON.stringify(posts));

            location.reload();
        });


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "삭제";

        deleteButton.addEventListener("click", function() {
            const deleteConfirm = confirm("이 게시글을 삭제하시겠습니까?");

            if (deleteConfirm === true) {
                const newPosts = posts.filter(function(item) {
                    return item.id !== post.id;
                });

                localStorage.setItem("posts", JSON.stringify(newPosts));

                location.reload();
            }
        });


        postElement.appendChild(titleElement);
        postElement.appendChild(contentElement);
        postElement.appendChild(editButton);
        postElement.appendChild(deleteButton);

        postList.appendChild(postElement);
    });
}


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
