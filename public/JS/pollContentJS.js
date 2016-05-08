function char(pollOptions, charData, boolean) {
    var ctx = document.getElementById("myChart");
    var data = {
        labels: pollOptions,
        datasets: [{
            data: charData,
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
    };
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: data,
    });
}


var createInput = document.querySelector('.createInput');
var selectpicker = document.querySelector('#selectpicker');
var change = document.querySelector('#change');
selectpicker.addEventListener('change', function() {
    if (selectpicker.value == 'create') {
        createInput.innerHTML = '<h5>Vote with my own option:</h5><input type="text" name="createOption">';
    }
    else {
        createInput.innerHTML = '';
    }
});


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

var input = document.querySelector('input');
var ifMyPollURL = window.location.href.replace('/poll/', '/ifMyPoll/');
var createRemovePollButtonDiv = document.querySelector('.createRemovePollButton');

function confirmRemoval() {
    var confirmResult = confirm('Are Sure to Remove ?');
    var url = window.location.href.replace('/poll/', '/removeMyPoll/');
    if (confirmResult == true) {
         function Redirect() {
               window.location="/";
            }
         ajaxFunctions.ajaxRequest('DELETE', url, function(data) {
             if (JSON.parse(data) == 'removed') {
                 Redirect();
             }
         });
    }
}

ajaxFunctions.ready(function() {
    ajaxFunctions.ajaxRequest('POST', window.location.href, function(data) {
        var pollOptions = JSON.parse(data)[0];
        var charData = JSON.parse(data)[1];
        char(pollOptions, charData);
    });
    ajaxFunctions.ajaxRequest('GET', ifMyPollURL, function(data) {
        if (JSON.parse(data) == 'true') {
            createRemovePollButtonDiv.innerHTML = '<button type="button" id="changeButton">Change the Text</button>';
        }
    });
});

input.addEventListener('click', function() {
    function getvotedOptionID() {
        var votedOption = $("form").serialize();

        if (votedOption.indexOf('createOption') == -1) {
            return $("form").serialize().match(/selectpicker\=(.*)/)[1];
        }
        else {
            return $("form").serialize().match(/create&(createOption\=.*)/)[1];
        }
    }
    var votedOptionID = getvotedOptionID();
    var appUrl = window.location + "?=" + votedOptionID;
    ajaxFunctions.ajaxRequest('delete', appUrl, function(data) {
        if (data == 'voted') {
            alert('You Can Only Vote Once Per Poll');
        }
        else {

            var pollOptions = JSON.parse(data)[0];
            var charData = JSON.parse(data)[1];
            char(pollOptions, charData);
        }
    });
});
