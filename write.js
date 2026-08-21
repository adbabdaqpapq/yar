const postButton = document.getElementById("post-button");

postButton.addEventListener("click", function() {
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;

    if (title === "" || content === "") {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
    }

    const post = {
        id: Date.now(),
        title: title,
        content: content
    };

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.push(post);

    localStorage.setItem("posts", JSON.stringify(posts));

    alert("게시글이 등록되었습니다!");

    window.location.href = "index.html";
});
