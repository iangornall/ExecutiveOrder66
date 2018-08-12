var clearDisplay = function() {
    console.log("Clearing Display");
    var container = document.querySelector(".postbody");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
}

var populatePosts = function(postList, start, numPosts) {
    console.log(postList);
    clearDisplay();
    postListFirstFive = postList.slice(start, start + numPosts);
    var firebaseuser = firebase.auth().currentUser;
    var container = document.querySelector(".postbody");
    postListFirstFive.forEach(function(post) {
        var postContainer = document.createElement('div');
        postContainer.classList.add('post');

        var postImage = document.createElement('img');
        postImage.classList.add('googleIMG');
        postImage.setAttribute('src', post.placeImageURL);
        postContainer.appendChild(postImage);

        var postText = document.createElement('div');
        postText.classList.add('posttext');
        postContainer.appendChild(postText);

        var postLocation = document.createElement('div');
        postLocation.classList.add('location');
        postLocation.textContent = post.placeName;
        postText.appendChild(postLocation);

        var postAuthor = document.createElement('div');
        postAuthor.classList.add('author');
        postAuthor.textContent = post.author;
        postText.appendChild(postAuthor);

        var postContent = document.createElement('div');
        postContent.classList.add('postcontent');
        postContent.textContent = post.placeExperience;
        postText.appendChild(postContent);

        var postRating = document.createElement('div');
        postRating.classList.add('rating');
        postText.appendChild(postRating);

        var postTime = document.createElement('div');
        postTime.classList.add('datetime');
        var dateTime = new Date(post.dateTime);
        postTime.textContent = dateTime.toLocaleString();
        postText.appendChild(postTime);

        for (var i = 0; i < Number(post.placeRating); i++) {
            var ratingGem = document.createElement('img');
            ratingGem.setAttribute('src', 'images/gem3.png');
            ratingGem.classList.add('ratinggem');
            postRating.appendChild(ratingGem);
        }

        var postMap = document.createElement('iframe');
        postMap.classList.add('googleIMG');
        postMap.setAttribute('allowfullscreen', true);
        postMap.src = getLocation(post.placeName);
        postContainer.appendChild(postMap);

        if ((firebaseuser) && (post.placeOwner === firebaseuser.uid)) {
            var postButtonContainer = document.createElement('div');
            postButtonContainer.classList.add('post-button-container');

            var postEdit = document.createElement('button');
            postEdit.classList.add('buttonclass', 'post-button', 'editPost')
            postEdit.textContent = "Edit";
            postButtonContainer.appendChild(postEdit);
            var editPostDOM = function() {
                var myPlace = document.querySelector('[name="placeName"]');
                var myAuthor = document.querySelector('[name="author"]');
                var myPlaceType = document.querySelector('[name="placeType"]');
                var myExperience = document.querySelector('[name="placeExperience"]');
                for (let i = 1; i <= post.placeRating; i++) {
                    let gem = document.querySelector(`[name='gem${i}']`);
                    gem.setAttribute('src', 'images/gem3.png');
                    console.log(gem);
                }
                ratingValue = post.placeRating;
                myPlace.value = post.placeName;
                myAuthor.value = post.author;
                myPlaceType.value = post.placeType;
                myExperience.value = post.placeExperience;
                modal.classList.toggle("showmodal");
                console.log(post);
                var myForm = document.querySelector('.submissionform');
                myForm.removeEventListener('submit', newPost);
                var handleSubmit = function(event) {
                    event.preventDefault();
                    var firebaseuser = firebase.auth().currentUser;
                    if (firebaseuser) {
                        toggleModal(event);
                        var newPostData = {
                            placeNameq: myPlace.value,
                            placeOwner: firebaseuser.uid,
                            author: myAuthor.value,
                            placeType: myPlaceType.value,
                            placeExperience: myExperience.value,
                            placeRating: Number(ratingValue),
                            placeImageURL: post.placeImageURL,
                            dateTime: post.dateTime
                        };
                    }
                    editPost(post.postKey, newPostData);
                    myForm.removeEventListener('submit', handleSubmit);
                    myForm.addEventListener('submit', newPost);
                };
                myForm.addEventListener('submit', handleSubmit);
            };
            postEdit.addEventListener('click', editPostDOM);

            var postDelete = document.createElement('button');
            postDelete.classList.add('buttonclass', 'post-button', 'deletePost');
            postDelete.textContent = "Delete";
            postButtonContainer.appendChild(postDelete);
            var removePostDOM = function() {
                removePost(post, firebaseuser);
                displayFlashMessage('You have successfully removed post.');
            };
            postDelete.addEventListener('click', removePostDOM);
            
            postContainer.appendChild(postButtonContainer);
        }
        container.appendChild(postContainer);
    });
}

//     Just for reference:
// {   placeName: string,
//     author: string,
//     placeType: string,
//     placeExperience: string,
//     placeRating: Number,
//     placeImageURL : string,
//     postKey: string
// }

var newPost = function(event) {
    event.preventDefault();
    var firebaseuser = firebase.auth().currentUser;
    if (firebaseuser) {
        var handleURL = function(url) {
            toggleModal(event);
            console.log('New Post. Saving...');
            var myAuthor = document.querySelector('[name="author"]');
            var myPlaceType = document.querySelector('[name="placeType"]');
            var myExperience = document.querySelector('[name="placeExperience"]');
            var timestamp = Date.now();
            var newPostData = {
                placeName: myPlace.value,
                placeOwner: firebaseuser.uid,
                author: myAuthor.value,
                placeType: myPlaceType.value,
                placeExperience: myExperience.value,
                placeRating: Number(ratingValue),
                placeImageURL: url,
                dateTime: timestamp
                };
            console.log(newPostData);
            savePost(newPostData);
            };
        var myPlace = document.querySelector('[name="placeName"]');
        getImgSrc(myPlace.value, handleURL);
    } else {
        console.log('Sorry. You arent logged in.');
        displayFlashMessage("Sorry. You aren't logged in.");
    }
}