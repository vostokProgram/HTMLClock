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

function insertAlarm(hours, mins, ampm, alarmName) {
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
              .html(hours+":"+mins+" "+ampm)
         )
      ;
   $("#alarms").append(newAlarmDiv);
}

function addAlarm() {
   var hours, mins, ampm, alarmName;
   hours = $("#hours option:selected").text();
   mins = $("#mins option:selected").text();
   ampm = $("#ampm option:selected").text();
   alarmName = $("#alarmName").val();

   insertAlarm(hours, mins, ampm, alarmName);
   hideAlarmPopup();
}

window.onload = function() {
   getTime();
   getTemp();
};