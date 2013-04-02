var interests = [];

function personalize() {
  if (typeof navigator.interests != 'undefined') {
    navigator.interests.getTopInterests().then(populateInterests);
  }
  else {
    $("#error").modal('show');
  }
}

function consoleTop() {
    if (typeof navigator.interests != 'undefined') {
      $('#output').html('');
      var num = $("#count").val();
      navigator.interests.getTopInterests(num).then(consoleUpdateInterests);
    }
    else {
      $("#error").modal('show');
    }
}

function consoleQuery() {
    if (typeof navigator.interests != 'undefined') {
      $('#output').html('');
      var ints = $("#query").val().split(", ");
      navigator.interests.checkInterests(ints).then(consoleUpdateInterests);
    }
    else {
      $("#error").modal('show');
    }
}

function consoleUpdateInterests(_int) {
    $("#output").html(JSON.stringify(_int, undefined, 2));
    $("#output").show();
}

function populateInterests(_int) {
    if (_int.length > 0) {
        clearWall();
        $(".jumbotron .btn").hide();
        
        var j = 0;
        var lead = "Showing photos relating to your top interests of ";
        $.each(_int, function(k, v) {
            if (j < 5) {
                getPhotosByTag(v['name']);
                
                if (j != 0) {
                    lead += ", ";
                }
                if (j == (_int.length - 1)) {
                    lead += "and ";
                }
                
                lead += "<strong class=\"text-info\">" + v['name'] + "</strong>";
            }
            j++;
        });
        lead += ".";
    }
    else {
        var lead = "You do not yet have enough interests to personalize the photo wall.";
    }
    $(".lead").html(lead);
}

function getRecentPhotos() { $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getrecent&api_key=e4d4d87b4fa8b0f25a6ff2fa6ed86f6c&per_page=50&format=json&nojsoncallback=1", addPhotosToWall);
}

function getPhotosByTag(tag) {   $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e4d4d87b4fa8b0f25a6ff2fa6ed86f6c&tags=" + tag + "&safe_search=1&media=photos&per_page=20&format=json&nojsoncallback=1", addPhotosToWall);
}

function addPhotosToWall(data) {
  $.each(data['photos']['photo'], function(k, v) {
    $("#photos").append("<div class=\"span2\"><a href=\"http://www.flickr.com/photos/" + v['owner'] + "/" + v['id'] + "\"><img src=\"http://farm" + v['farm'] + ".staticflickr.com/" + v['server'] + "/" + v['id'] + "_" + v['secret'] + "_m.jpg\"/></a></div>");
  });
}

function clearWall() {
  $("#photos").html("");
}

$(document).ready(getRecentPhotos);