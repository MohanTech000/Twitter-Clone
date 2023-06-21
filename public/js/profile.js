$(document).ready(() => {   

    if(selectedTab === "replies") {
        loadReplies();

    }else{
        loadPosts();
    }
});

loadPosts = () => {
    $.get("/api/posts", {postedBy: profileUserId, isReply: false}, results => {
        outputPosts(results, $(".postsContainer"))
    });
}

loadReplies = () => {
    $.get("/api/posts", {postedBy: profileUserId, isReply: true}, results => {
        outputPosts(results, $(".postsContainer"))
    });
}

