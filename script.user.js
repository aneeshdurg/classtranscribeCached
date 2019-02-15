// ==UserScript==
// @name        Resume location on classTranscribe
// @include     https://www.classtranscribe.com/watchLectureVideos/*
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==

(async () => {
	var url_array = document.URL.split('/');
	var class_id = url_array.pop() || url_array.pop();
	var class_info = JSON.parse(await GM.getValue(class_id, "{}"));

	function get_current_video() {
	  var selected = document.querySelector('.vjs-playlist-item.vjs-selected');
	  if (!selected) {
	    return null;
	  }

	  var name = selected.querySelector('cite');
	  if (!name) {
	    return null;
	  }

	  curr_video = name.innerHTML;
	  return curr_video;
	}

	function set_last_watched() {
	  var curr_video = get_current_video();
	  class_info.last_watched = curr_video;
	  GM.setValue(class_id, JSON.stringify(class_info));
	}

	window.addEventListener('load', function() {
	  var curr_video = get_current_video();
	  if (!class_info.hasOwnProperty('last_watched')){
	    class_info.last_watched = curr_video;
	  } else {
	    console.log('Last watched was: ' + curr_video);
	  }

	  setInterval(set_last_watched, 5000);
	}, false);

	window.addEventListener('beforeunload', function(e) {
	  set_last_watched();
	});
})();
