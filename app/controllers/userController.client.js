'use strict';

(function() {

   var appUrl = window.location.origin;
   var allPollContainer = document.querySelector('.allPollContainer');
   var pollListTitleButton = document.querySelector('.pollListTitle');
   var allPollApiUrl = appUrl + '/allpoll';
   var pollContent = document.querySelector('.pollContent');

   // ajax-function

   var ajaxFunctions = {
      ready: function ready(fn) {
         if (typeof fn !== 'function') {
            return;
         }

         if (document.readyState === 'complete') {
            return fn();
         }

         document.addEventListener('DOMContentLoaded', fn, false);
      },
      ajaxRequest: function ajaxRequest(method, url, callback) {
         var xmlhttp = new XMLHttpRequest();

         xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
               callback(xmlhttp.response);
            }
         };

         xmlhttp.open(method, url, true);
         xmlhttp.send();
      }
   };

   // ajax-function



   var indexOrNot = window.location.href.indexOf('/myPoll');
   if (indexOrNot > -1) {
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('Post', allPollApiUrl, function(data) {
         allPollContainer.innerHTML = data;
      }));
   }
   else {
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', allPollApiUrl, function(data) {
         allPollContainer.innerHTML = data;
      }));
   }

function popupTwittWindow() {
   var twitterIntent = "https://twitter.com/intent/tweet?url=";
   var twittURI = twitterIntent + window.location.href + "&text=" + document.title;
   window.open(twittURI, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=600,height=600");
}

})();
