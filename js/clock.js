function getTime() {
    document.getElementById("clock").innerHTML = new Date();
    setTimeout(getTime, 1000);
}

function getTemp() {
    $.getJSON(
        "https://api.forecast.io/forecast/abb5355d28533ac9d3091d7e872f8347/35.300399,-120.662362?callback=?",
        {},
        function(data) {
            var maxtemp;
            var cls;
            
            $("#forecastLabel").html(data.daily.summary);
            $("#forecastIcon").attr("src", "img/"+data.daily.icon+".png");
            maxtemp = data.daily.data[0].temperatureMax;
            console.log(maxtemp);
            cls;
            if (maxtemp >= 90) {
                cls = "hot";
            }
            else if (maxtemp >= 80) {
                cls = "warm";
            }
            else if (maxtemp >= 70) {
                cls = "nice";
            }
            else if (maxtemp >= 60) {
                cls = "chilly";
            }
            else {
                cls = "cold";
            }

            $("body").addClass(cls);
        }
    );
}

function showAlarmPopup() {
    $("#mask").removeClass("hide");
    $("#popup").removeClass("hide");
}

function hideAlarmPopup() {
    $("#mask").addClass("hide");
    $("#popup").addClass("hide");
}

function insertAlarm(time, alarmName) {
    var newAlarmDiv = $("<div>");
    newAlarmDiv
        .addClass("flexable")
        .append($("<div>")
                .addClass("name")
                .html(alarmName)
               )
    ;
    newAlarmDiv
        .append($("<div>")
                .addClass("time")
                .html(time)
               )
    ;
    $("#alarms").append(newAlarmDiv);
}

function addAlarm() {
    var hours, mins, ampm, alarmName, time;
    hours = $("#hours option:selected").text();
    mins = $("#mins option:selected").text();
    ampm = $("#ampm option:selected").text();
    alarmName = $("#alarmName").val();

    time = hours+":"+mins+" "+ampm;

    gapi
        .client.plus.people.get({ userId: 'me' })
        .execute(function(response) {
            var AlarmObject = Parse.Object.extend("Alarm");
            var alarmObject = new AlarmObject();
            alarmObject.save(
                {
                    userId: response.result.id,
                    time: time,
                    alarmName: alarmName
                },
                {
                    success:
                    function(object) {
                        insertAlarm(time, alarmName);
                        hideAlarmPopup();
                    }
                }
            );
        });

    

}

function getAllAlarms(userId) {
    Parse.initialize("wa8Z12x1UgImiDUfJxVUHmALc4fXCAyVpLjzXmrc", "iejXXr04iVBt8iyQOZs3gKZCl5vntv8HgmiuVYPR");

    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.find({
        success:
        function(results) {
            for (var i = 0; i < results.length; i++) {
                var alarm = results[i];
                if (alarm.get("userId") == userId) {
                    insertAlarm(alarm.get("time"), alarm.get("alarmName"));
                }
                
            }
        }
    });
}

function deleteAlarm() {
    console.log("delete alarm");
    Parse.initialize("wa8Z12x1UgImiDUfJxVUHmALc4fXCAyVpLjzXmrc", "iejXXr04iVBt8iyQOZs3gKZCl5vntv8HgmiuVYPR");
    var alarmId = $("#deleteBox").val();
    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.find({
        success:
        function(results) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].attributes.alarmName == alarmId) {
                    results[i].destroy({
                        success:
                        function(obj) {
                            console.log("successful delete");
                            $("#alarms").empty();
                            getAllAlarms();
                        },
                        error:
                        function(obj, err) {
                            console.log("delete failed: " + err);
                        }
                    });
                }
            }
        }
    });
}

function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        gapi.client.load('plus', 'v1',function(){
            gapi
                .client.plus.people.get({ userId: 'me' })
                .execute(function(response) {
                    $("#name-container").text(response.result.displayName);
                    getAllAlarms(response.result.id);
                });});
        // Update the app to reflect a signed in user
        // Hide the sign-in button now that the user is authorized, for example:
        document.getElementById('signinButton').setAttribute('style', 'display: none');
        

    } else {
        // Update the app to reflect a signed out user
        // Possible error values:
        //   "user_signed_out" - User is signed-out
        //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
  }
}

window.onload = function() {
    getTime();
    getTemp();

};
