const urlParams = new URLSearchParams(window.location.search);
const postId = Number(urlParams.get("id"));

const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

const post = savedPosts.find(function(item) {
    return item.id === postId;
});

const postDetail = document.getElementById("post-detail");

if (post === undefined) {
    postDetail.innerHTML = "<p>게시글을 찾을 수 없습니다.</p>";
} else {
    const titleElement = document.createElement("h2");
    titleElement.textContent = post.title;

    const contentElement = document.createElement("p");
    contentElement.textContent = post.content;

    postDetail.appendChild(titleElement);
    postDetail.appendChild(contentElement);


    const commentTitle = document.createElement("h3");
    commentTitle.textContent = "댓글";

    postDetail.appendChild(commentTitle);


    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "댓글을 입력하세요";

    const commentButton = document.createElement("button");
    commentButton.textContent = "댓글 작성";

    const commentList = document.createElement("div");


    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];

    savedComments.forEach(function(comment) {
        if (comment.postId === post.id) {
            const commentElement = document.createElement("p");
            commentElement.textContent = comment.content;

            commentList.appendChild(commentElement);
        }
    });


    commentButton.addEventListener("click", function() {
        const commentContent = commentInput.value;

        if (commentContent === "") {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        const comments = JSON.parse(localStorage.getItem("comments")) || [];

        const newComment = {
            postId: post.id,
            content: commentContent
        };

        comments.push(newComment);

        localStorage.setItem("comments", JSON.stringify(comments));

        const commentElement = document.createElement("p");
        commentElement.textContent = commentContent;

        commentList.appendChild(commentElement);

        commentInput.value = "";
    });


    postDetail.appendChild(commentInput);
    postDetail.appendChild(commentButton);
    postDetail.appendChild(commentList);
}
