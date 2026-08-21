const postButton = document.getElementById("post-button");

postButton.addEventListener("click", function() {
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;

    if (title === "" || content === "") {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
    }

    const post = {
    title: title,
    content: content
    };

    localStorage.setItem("post", JSON.stringify(post));

    alert("게시글이 등록되었습니다!");

    window.location.href = "index.html";
        });
