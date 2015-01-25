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

window.onload = function() {
   getTime();
   getTemp();
};