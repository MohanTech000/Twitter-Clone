$("#postTextarea, #replyTextarea").keyup(event => {
    let textBox = $(event.target);
    let value = textBox.val().trim();
    console.log(value);

    let isModal = textBox.parents(".modal").length == 1;

    let submitButton = isModal ?  $("#submitReplyButton") : $("#submitPostButton");
    if (submitButton.length == 0) return alert("No submit button found");

    if (value == "") {
        submitButton.prop("disabled", true)
        return;
    }

    submitButton.prop("disabled", false)
});

$("#submitPostButton, #submitReplyButton").click(event => {

    let button = $(event.target);
    let isModal = button.parents(".modal").length == 1;
    let textBox = isModal ? $("#replyTextarea") : $("#postTextarea");    

    let data = {
        content: textBox.val()
    }

    if(isModal) {
        let id = button.data().id;
        if(id == null) {
        return alert("button id is null")
    }
    data.replyTo = id;
    }

    $.post("/api/posts", data, postData => {

        if(postData.replyTo) {
            location.reload()
        }
        else{
            let html = createPostHtml(postData);
            $(".postsContainer").prepend(html);
            textBox.val("");
            button.prop("disabled", true);  
        }
    });




});

$("#deletePostModal").on("show.bs.modal", (event) => {

    let button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);
    $("#deletePostButton").data("id", postId);

    console.log($("#deletePostButton").data().id);

});

//deleting the post
$("#deletePostModal").click((event) => {
    let postId = $(event.target).data("id");

    $.ajax({
        url: `/api/posts/${postId}`,
        type: "DELETE",
        success: (data, status, xhr) => {
            
            if(xhr.status != 202) {
                alert("Could not delete the post")
                return;
            }

            location.reload()

        }
    })
})

//clearing the reply modal when it is closed
$("#replyModal").on("hidden.bs.modal", () => {

    $("#originalPostContainer").html("");

});

//getting the id of the post we want to delete
$("#replyModal").on("show.bs.modal", (event) => {

    let button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);
    $("#submitReplyButton").data("id", postId);

    $.get("/api/posts/" + postId, results => {
        outputPosts(results.postData, $("#originalPostContainer"));
        // console.log(results);
    });


});

$(document).on("click", ".likeButton", (event) => {

    let button = $(event.target);
    let postId = getPostIdFromElement(button);

    if (postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {

            button.find("span").text(postData.likes.length || "")

            if (postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active");
            }
            else {
                button.removeClass("active")
            }

        }
    })

});

$(document).on("click", ".retweetButton", (event) => {

    let button = $(event.target);
    let postId = getPostIdFromElement(button);

    if (postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: "POST",
        success: (postData) => {
            console.log(postData);

            button.find("span").text(postData.retweetUsers.length || "")

            if (postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active");
            }
            else {
                button.removeClass("active")
            }

        }
    });

});


//view post page
$(document).on("click", ".post", (event) => {

    let element = $(event.target);
    let postId = getPostIdFromElement(element);

    if (postId !== undefined && !$(element).closest("button").length) {
        window.location.href = "/post/" + postId;
    }
    
    
});



function getPostIdFromElement(element) {
    let isRoot = element.hasClass("post");
    let rootElement = isRoot == true ? element : element.closest(".post");
    let postId = rootElement.data().id;

    if (postId === undefined) return alert("post id undefined")

    return postId;
}




function createPostHtml(postData, largeFont = false) {


    if (postData == null) return alert("post object is null");

    let isRetweet = postData.retweetData !== undefined;
    let retweetedBy = isRetweet ? postData.postedBy.userName : null;
    postData = isRetweet ? postData.retweetData : postData

    let postedBy = postData.postedBy;



    if (postedBy._id === undefined) {
        return alert("user object not populated");
    }




    let displayName = postedBy.firstName + " " + postedBy.lastName;
    let timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    let retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";
    let largeFontClass = largeFont ? "largeFont" : "";

    let retweetText = "";

    if (isRetweet) {
        retweetText = `<span>
        <i class="fas fa-retweet"></i>
        Retweeted by <a href="/profile/${retweetedBy}">@${retweetedBy}</a>
        </span>`
    }


    let replyFlag = "";
    if(postData.replyTo && postData.replyTo._id){
        
        if(!postData.replyTo._id){
            return alert("Reply is not populated");
        }
        else {
            if(!postData.replyTo.postedBy._id){
                return alert("PostedBy is not populated");
            }
            
            let replyUsername = postData.replyTo.postedBy.userName;
            replyFlag =  `<div class="replyFlag">

                        Replying to <a href="/profile/${replyUsername}">${replyUsername}</a>

            </div>`
        }
    }

    let buttons = "";
    if(postData.postedBy._id == userLoggedIn._id) {
        buttons = `<button data-id = "${postData._id}" data-toggle="modal" data-target="#deletePostModal">
        <i class="fas fa-times"> </i>
        </button>`
    }

    return `<div class="post ${largeFontClass}" data-id = "${postData._id}"> 

        <div class="postActionContainer">
            ${retweetText}
        </div>
    
        <div class="mainContentContainer"> 
        
        <div class="userImageContainer"> 
        <img src="${postedBy.profilePic}">
        </div>

        <div class="postContentContainer"> 

        <div class="header"> 
        <a href="/profile/${postedBy.userName}" class="displayName">${displayName}</a>
        <span class="userName">@${postedBy.userName}</span>
        <span class="date">${timestamp}</span>
        ${buttons}


        </div>

        ${replyFlag}

        <div class="postBody"> 
        <span>${postData.content}</span>    
        </div>

        <div class="postFooter"> 

        <div class="postButtonContainer">
             <button data-toggle="modal" data-target="#replyModal">
                <i class="far fa-comment"></i>
            </button>
        </div> 
    
        
        <div class="postButtonContainer green">
        <button class="retweetButton ${retweetButtonActiveClass}">
            <i class="fas fa-retweet"></i>
            <span>${postData.retweetUsers.length || ""}</span>
        </button>
        </div>

        <div class="postButtonContainer red">
         <button class="likeButton ${likeButtonActiveClass}">
            <i class="far fa-heart"></i>
            <span>${postData.likes.length || ""}</span>
        </button>
        </div>


        </div>

        </div>

        </div>
    
    </div>`;

}

//getting post's timestamp

function timeDifference(current, previous) {

    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Just now";

        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}

function outputPosts(results, container) {
    container.html = "";

    if(!Array.isArray(results)) {
        results = [results];
    }


    results.forEach(result => {
        let html = createPostHtml(result)
        container.append(html);
    });

    if(results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}

outputPostsWithReplies = (results, container) => {
    container.html = "";

    if(results.replyTo !== undefined && results.replyTo._id !== undefined) {
        let html = createPostHtml(results.replyTo)
        container.append(html);
    }

    let mainPostHtml = createPostHtml(results.postData, true)
    container.append(mainPostHtml);

    results.replies.forEach(result => {
        let html = createPostHtml(result)
        container.append(html);
    });
}

