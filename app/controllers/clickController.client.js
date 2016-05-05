'use strict';

(function() {

   var appUrl = window.location.origin;
   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var apiUrl = appUrl + '/api/:id/clicks';


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

   function updateClickCount(data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

   addButton.addEventListener('click', function() {

      ajaxFunctions.ajaxRequest('POST', apiUrl, function() {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

   deleteButton.addEventListener('click', function() {

      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function() {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

})();
