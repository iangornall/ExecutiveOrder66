// Initialize Firebase
var config = {
  apiKey: firebaseAPIKey,
  authDomain: "legion-of-doom-" + firebaseIdentifier + ".firebaseapp.com",
  databaseURL: "https://legion-of-doom-" + firebaseIdentifier + ".firebaseio.com",
  projectId: "legion-of-doom-" + firebaseIdentifier,
  storageBucket: "legion-of-doom-" + firebaseIdentifier + ".appspot.com",
  messagingSenderId: "179515365777"
  };

firebase.initializeApp(config);
var database = firebase.database();
var postList = [];

var convertToArray = function(data) {
  postList = [];
  Object.values(data).forEach(function(postFromFB) {
      console.log('Push post to post list: ' + postFromFB.placeName)
      postList.push(postFromFB);
  });
  console.log('Converted to array...');
  console.log(postList);
}

var savePost = function(postData) {
  console.log('saving post: ' + postData.placeName);
  var myPostKey = firebase.database().ref().child('posts').push().key;
  postData.postKey = myPostKey;
  firebase.database().ref('posts/' + myPostKey).set(postData, error => {
    if (error) {
      displayFlashMessage("Your post failed. " + error + " Please try again.");
    } else {
      displayFlashMessage("You have successfully created a new post!");
    }
  });
  var myForm = document.querySelector(".newpost");
  myForm.reset();
  loadPosts();
}

var editPost = function(myPostKey, postData) {
  firebase.database().ref('posts/' + myPostKey).set(postData, error => {
    if (error) {
      displayFlashMessage("Your edit failed. " + error + "Please try again.");
    } else {
      displayFlashMessage("You have successfully edited your post!");
    }
  });
  loadPosts();
}

var removePost = function(post, firebaseuser) {
      console.log('I am: ' + firebaseuser.uid);
      if ((firebaseuser) && (post.placeOwner === firebaseuser.uid)) { 
        console.log('Post deleted: ' + post.postKey);
        firebase.database().ref('posts/' + post.postKey).remove();
        loadPosts();
      }
}

var loadPosts = function(filter, startPost = 0, numPosts = 5) {
  console.log('loading saved posts...');
  firebase.database().ref('posts').once('value').then(function(data) {
    console.log(data.val());
    convertToArray(data.val());
    postList = postList.sort((a, b) => b.dateTime - a.dateTime);
    console.log('sorted', postList);
    displayPostTotal = postList.length;
    var filteredPostList;
    if (filter) {
      if (filter.hasOwnProperty('placeType')) {
        if (filter.placeType === "") {
          populatePosts(postList, startPost, numPosts);
        } else {
          var filteredPostList = postList.filter(post => post.placeType === filter.placeType);
          populatePosts(filteredPostList, startPost, numPosts);
          displayPostTotal = filteredPostList.length;
        }
      } else if (filter.hasOwnProperty('placeName')) {
        filteredPostList = postList.filter(post => post.placeName.toLowerCase().includes(filter.placeName.toLowerCase()) || post.placeExperience.toLowerCase().includes(filter.placeName.toLowerCase()));
        populatePosts(filteredPostList, startPost, numPosts);
        displayPostTotal = filteredPostList.length;
      } else if (filter.hasOwnProperty('placeRating')) {
        if (filter.placeRating === "") {
          populatePosts(postList, startPost, numPosts);
        } else {
          filteredPostList = postList.filter(post => post.placeRating === filter.placeRating);
          populatePosts(filteredPostList, startPost, numPosts);
          displayPostTotal = filteredPostList.length;
        }
      }
    } else {
    populatePosts(postList, startPost, numPosts);
    }
  });
}