var getImgSrc = function(query, callback) {
  var regEx = /^[A-Za-z0-9 _]*$/;
  if (regEx.test(query)) {
    $.getJSON('https://www.googleapis.com/customsearch/v1/?cx=010289098104679464911:xwek1ikjodk&key=' + googleAPIKey + '&searchType=image&num=1&siteSearch=*.facebook.com/*&siteSearchFilter=e&safe=medium&q=' + query + ' Atlanta', data => {
      if (data.items) {
        callback(data.items[0].link)
      } else {
        displayFlashMessage("We failed to find your gem.  Try a different place name.");
      }
    })
    .fail(() => displayFlashMessage("We failed to find your gem.  Try a different place name."))
  } else {
    displayFlashMessage('Place names must be letters or numbers only. Try again.');
  }
}

var getLocation = function(query) {
  return 'https://www.google.com/maps/embed/v1/place?key=' + googleCloudAPIKey + '&q=' + query + ',Atlanta+GA';
}