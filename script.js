const temp = document.getElementById("temp");


let currentCity = "";
let currentUnit = "";
let hurlyorWeek = "Week";


// Update time 

function getDataTime() {
    let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();


    let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    hour = hour % 12;
    if(hour < 10){
        hour = "0" + hour;
    }
    else if(minute < 10){
        minute = "0" + minute;
    }

    let dayString = days[now.getDay()]
    return `${dayString},${hour}:${minute}`;
}