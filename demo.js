var interests = [];

function personalize() {
  if (typeof navigator.interests != 'undefined') {
    navigator.interests.getTopInterests(5).then(populateInterests);
  }
  else {
    $("#error").modal('show');
  }
}

function consoleTop() {
    if (typeof navigator.interests != 'undefined') {
      $('#output').html('');
      var num = parseInt($("#count").val());
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
      navigator.interests.getInterests(ints).then(consoleUpdateInterests);
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
                $("#content").append('<div id="interest' + (j + 1) + '"><h3>' + (j + 1) + '. ' + v['name'] + '</h3><ul class="thumbnails"></ul></div><hr>');
                getPostsByTag(v['name'], j + 1);
                
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

function addPhotosToWall(data) {
    $("#content").append('<ul class="thumbnails"></ul>');
    var ul = $('#content .thumbnails');
    
    $.each(data['photos']['photo'], function(k, v) {
        ul.append('<li class="span3"><div class="thumbnail"><a href="http://www.flickr.com/photos/' + v['owner'] + '/' + v['id'] + '"><img src="http://farm' + v['farm'] + '.staticflickr.com/' + v['server'] + '/' + v['id'] + '_' + v['secret'] + '_m.jpg"/>' + (v['title'] != '' ? '<p><small>' + v['title'].trunc(70, true) + '</small></p>' : '') + '</a></div></li>');
    });
    ul.imagesLoaded( function() { ul.masonry(); });
}

function getPostsByTag(tag, int_num) {
    $('body').append('<script src="http://api.tumblr.com/v2/tagged?tag=' + tag + '&filter=text&&api_key=AOiwk96Nu7FpdEMEFkDAal0A8bhvsFJquJh2XNLh1RcNOl6shp&callback=jsonpInterest' + int_num + '"></script>');
}

function addPosts(data, int_num) {
    var ul = $("#interest" + int_num + " ul");
    $.each(data.response, function(k, v) {
        if (v['type'] == 'photo') {
          ul.append('<li class="span3"><div class="thumbnail"><a href="' + v['post_url'] + '" target="_blank"><img src="' + v['photos'][0]['alt_sizes'][1]['url'] + '"/>' + (v['caption'] != '' ? '<p><small>' + v['caption'].trunc(70, true) + '</small></p>' : '') + '</a></div></li>');
        }
    });
    ul.imagesLoaded( function() { ul.masonry(); });
}

function jsonpInterest1(data) { addPosts(data, 1); }
function jsonpInterest2(data) { addPosts(data, 2); }
function jsonpInterest3(data) { addPosts(data, 3); }
function jsonpInterest4(data) { addPosts(data, 4); }
function jsonpInterest5(data) { addPosts(data, 5); }


function clearWall() {
  $("#content").html("");
}

String.prototype.trunc =
     function(n,useWordBoundary){
         var toLong = this.length>n,
             s_ = toLong ? this.substr(0,n-1) : this;
         s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  toLong ? s_ + '&hellip;' : s_;
      };
$(document).ready(getRecentPhotos);