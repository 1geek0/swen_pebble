/*
 * This represents the HackerNews website
 */


module.exports = (function(){  

  var ajax = require('ajax'); 

  var SwenNews = function() {
    // API Endpoints to access
    
    // top stories listing
    this.URL_TOPSTORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    
    // Item prefix (followed by "[item number].json")
    this.URL_ITEM       = 'https://hacker-news.firebaseio.com/v0/item/';
    
    // Top stories list
    this.top = [];
    // Cache for stories we have downloaded
    this.cache = [];
  
  };
  
  SwenNews.prototype.getTopStories = function(callback) {
    var SN = this;
    ajax({
        url: SN.URL_TOPSTORIES,
        type: 'json'
      },         
         
      // Success
      function (data) {
        if (Array.isArray(data)) {
          SN.top = data;
          callback();
        } else {
          console.log('failed to get stories');
        }
      },
      // Error
      function (error) {
        console.log('failed to get stories: ' + error);
    this.backgroundColor('blue');
    }); // ajax()
  };
  
  SwenNews.prototype.getStory = function(top_story_index, callback) {
    var story_id = this.top[top_story_index];
    // If in cache
    if (this.cache[story_id]) {
      // Callback if it is set
      if (callback) {
        callback(this.cache[story_id]);
      }
    // If not in cache
    } else {
      var SN = this;
      // Attempt to download story
      ajax({
          url: SN.URL_ITEM + story_id + '.json',
          type: 'json'
      },           
           // Success
        function(data) {
          // Save to the cache
          SN.cache[story_id] = data;
          // Callback if it is set
          if (callback) {
            callback(SN.cache[story_id]);
          }
        },           
        // Error
        function(error) {
          console.log('failed to get story: ' + error);
      });
      

    } // else
  };
  
  SwenNews.prototype.getStories = function(current, max, callback) {
    var SN = this;
    if (current == max) {
      if (callback) {
        callback();
      }
      return;
    }
    this.getStory(current, function() {
      current++;
      SN.getStories(current, max, callback);
    });
  };
  
  SwenNews.prototype.refreshStories = function(callback) {
    var SN = this;
    this.getTopStories(function() {
      SN.getStories(0, 25, callback);
    });
  };
  
  return SwenNews;
  
})();