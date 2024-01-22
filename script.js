const temp = document.getElementById("temp"),
        date = document.getElementById("date-time"),
        currentLocation = document.getElementById("location"),
        condition = document.getElementById("condition"),
        rain = document.getElementById("rain"),
        mainIcon = document.getElementById("icon"),
        uvIndex = document.querySelector(".uv-index"),
  uvText = document.querySelector(".uv-text"),
  windSpeed = document.querySelector(".wind-speed"),
  sunRise = document.querySelector(".sun-rise"),
  sunSet = document.querySelector(".sun-set"),
  humidity = document.querySelector(".humidity"),
  visibilty = document.querySelector(".visibilty"),
  humidityStatus = document.querySelector(".humidity-status"),
  airQuality = document.querySelector(".air-quality"),
  airQualityStatus = document.querySelector(".air-quality-status"),
  visibilityStatus = document.querySelector(".visibilty-status"),
  weatherCards = document.querySelector("#weather-cards");


// Get the current time
let currentCity = "";
let currentUnit = "c";
let hourlyWeek = "Week";


// Update time 

function getDataTime() {
    let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

// An array with the names of the days of the week

    let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

// Format the clock as 12-hour format
    hour = hour % 12;
    if(hour < 10){
        hour = "0" + hour;
    }
    // Add a zero in front of single-digit minutes
    else if(minute < 10){
        minute = "0" + minute;
    }

// Get the name of the day of the week  
    let dayString = days[now.getDay()]

    
// returning days hours and minutes
    return `${dayString},${hour}:${minute}`;
}

date.innerText = getDataTime();


// update time every second

setInterval(() => {
    date.innerText = getDataTime();
}, 1000);

// function to get public ip with fetch

function getPublicIp(){
    fetch("https://geolocation-db.com/json/",{
        method: "GET",
    } ) 
    .then((Response) => Response.json())
    .then((data) =>{
        console.log(data)
        currentCity = data.currentCity;
       getWeatherData(data.city , currentUnit , hourlyWeek)
    });
}

getPublicIp();

//function to get weather data  
 
function getWeatherData(city , unit , hourlyWeek){
        const apiKey = "LCEEDT5LGVHWR8V83E7CVVXSY";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
        method: "GET",
    }
    )
    .then((Response) => Response.json())
    .then((data) =>{
       let today = data.currentConditions;
       if(unit === "c"){
        temp.innerText = today.temp;
       }
       else{
        temp.innerText = celciusToFahrenheit(today.temp);
       }
       currentLocation.innerText = data.resolvedAddress;
       condition.innerText = today.conditions;
       rain.innerText = "Perc - " + today.precip + "%";
       uvIndex.innerText = today.uvindex;
       windSpeed.innerText = today.windspeed;
       humidity.innerText = today.humidity + "%";
       visibilty.innerText = today.visibility;
       airQuality.innerText = today.winddir;
       measureUvIndex(today.uvindex);
       updateHumidityStatus(today.humidity);
       updateVisibiltyStatus(today.visibility);
       updateAirQualityStatus(today.winddir);
       sunRise.innerText = covertTimeTo12HourFormat(today.sunrise);
       sunSet.innerText = covertTimeTo12HourFormat(today.sunset);
       mainIcon.src = getIcon(today.icon);
       if (hourlyorWeek === "hourly") {
        updateForecast(data.days[0].hours, unit, "day");
      }
       else {
        updateForecast(data.days, unit, "week");
      }
    })
}


//convert celsius to Fahrenheit
function celciusToFahrenheit(temp){
    return((temp*9)/5 + 32).toFixed(1);
}


//function to get uv index status
function measureUvIndex(uvIndex)
{
    if(uvIndex <=2)
    {
        uvText.innerText = "Low";
    }
    else if(uvIndex <=5)
    {
           uvText.innerText = "Moderate"
    }
    else if(uvIndex <=7)
    {
           uvText.innerText = "Hig"
    }
    else if(uvIndex <=10)
    {
           uvText.innerText = "Very Hig"
    }
    else  
    {
           uvText.innerText = "Extreme"
    }
}


function  updateHumidityStatus(humidity){
    if(humidity <= 30)
    {
        humidityStatus.innerText = "Low";
    }
    else if(humidity <= 60)
    {
        humidityStatus.innerText = "Moderate";
    }
    else
    {
        humidityStatus.innerText = "Hig";
    }

}

function updateVisibiltyStatus(visibility)
{
    if(visibility <= 0.3)
    {
        visibilityStatus.innerText = "Dense Fog";
    }
    else if(visibility <= 0.16)
    {
        visibilityStatus.innerText = "Moderate Fog";
    }
    else if(visibility <= 0.35)
    {
        visibilityStatus.innerText = "Light Fog";
    }
    else if(visibility <= 1.13)
    {
        visibilityStatus.innerText = "Very Light Fog";
    }  
    else if(visibility <= 2.16)
    {
        visibilityStatus.innerText = "Light Mist";
    }  
    else if(visibility <= 5.4)
    {
        visibilityStatus.innerText = "Very Light Mis";
    }
    else if(visibility <= 10.8)
    {
        visibilityStatus.innerText = "Clear Air";
    }
    else 
    {
        visibilityStatus.innerText = "Very Clear Air";
    }
}
function updateAirQualityStatus(airquality) {
    if (airquality <= 50) 
    {
      airQualityStatus.innerText = "Good👌";
    } 
    else if (airquality <= 100) 
    {
      airQualityStatus.innerText = "Moderate😐";
    } 
    else if (airquality <= 150) 
    {
      airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
    } 
    else if (airquality <= 200) 
    {
      airQualityStatus.innerText = "Unhealthy😷";
    } 
    else if (airquality <= 250)
    {
      airQualityStatus.innerText = "Very Unhealthy😨";
    }
     else 
    {
      airQualityStatus.innerText = "Hazardous😱";
    }
  }

  // convert time to 12 hour format
function covertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
  }
  

  function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
      return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
      return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
      return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
      return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
      return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
      return "https://i.ibb.co/rb4rrJL/26.png";
    }
  }

function getDayName(date){
    let day = new Date(date);
    let days = 
    [
        "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    ];
    return days[day.getDay()];
}
  //get hours from hh:mm:ss
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour < 12) {
      hour = hour - 12;
      return `${hour}:${min} PM`;
    } else {
      return `${hour}:${min} AM`;
    }
  }
//function to update Forecast
function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if (type === "day") {
      numCards = 24;
    } else {
      numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
      let card = document.createElement("div");
      card.classList.add("card");
      let dayName = getHour(data[day].datetime);
      if (type === "week") {
        dayName = getDayName(data[day].datetime);
      }
      let dayTemp = data[day].temp;
      if (unit === "f") {
        dayTemp = celciusToFahrenheit(data[day].temp);
      }
      let iconCondition = data[day].icon;
      let iconSrc = getIcon(iconCondition);
      let tempUnit = "°C";
      if (unit === "f") {
        tempUnit = "°F";
      }
      card.innerHTML = `
                  <h2 class="day-name">${dayName}</h2>
              <div class="card-icon">
                <img src="${iconSrc}" class="day-icon" alt="" />
              </div>
              <div class="day-temp">
                <h2 class="temp">${dayTemp}</h2>
                <span class="temp-unit">${tempUnit}</span>
              </div>
    `;
      weatherCards.appendChild(card);
      day++;
    }
  }
  
  