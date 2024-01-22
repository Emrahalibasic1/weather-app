const temp = document.getElementById("temp"),
        date = document.getElementById("date-time");

// Get the current time
let currentCity = "";
let currentUnit = "";
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
    });
}

getPublicIp();

//function to get weather data  
 