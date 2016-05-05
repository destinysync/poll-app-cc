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
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', allPollApiUrl, function(data) {
      allPollContainer.innerHTML = data;
   }));

})();
