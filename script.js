const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    currentLocation = document.getElementById("location"),
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
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    weatherCards = document.querySelector("#weather-cards");

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week";

// funkcija za dobivanje datuma i vremena
function getDateTime() {
  let now = new Date(),
      hour = now.getHours(),
      minute = now.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // 12-satni format
  let ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // sat '0' treba biti '12'

  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  let dayString = days[now.getDay()];
  return `${dayString}, ${hour}:${minute} ${ampm}`;
}

// Ažuriranje datuma i vremena
date.innerText = getDateTime();
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);

// funkcija za dobivanje lokacije korisnika putem preglednika
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const {
            latitude,
            longitude
          } = position.coords;
          getWeatherData(`${latitude},${longitude}`, currentUnit, hourlyorWeek);
        },
        (error) => {
          console.error("Greška pri dobivanju lokacije: ", error);
          getPublicIp();
        }
    );
  } else {
    console.error("Geolokacija nije podržana u ovom pregledniku.");
    getPublicIp();
  }
}

// funkcija za dobivanje javne IP adrese (kao alternativna metoda)
function getPublicIp() {
  fetch("https://geolocation-db.com/json/", {
    method: "GET",
    headers: {},
  })
      .then((response) => response.json())
      .then((data) => {
        getWeatherData(data.city, currentUnit, hourlyorWeek);
      })
      .catch((err) => {
        console.error(err);
      });
}

// Inicijalno pokretanje
getUserLocation();


// funkcija za dobivanje podataka o vremenu
function getWeatherData(city, unit, hourlyorWeek) {
  const apiKey = "LCEEDT5LGVHWR8V83E7CVVXSY";
  fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`, {
        method: "GET",
        headers: {},
      }
  )
      .then((response) => response.json())
      .then((data) => {
        let today = data.currentConditions;
        if (unit === "c") {
          temp.innerText = today.temp;
        } else {
          temp.innerText = celciusToFahrenheit(today.temp);
        }

        const cityName = data.resolvedAddress.split(',')[0];
        currentLocation.innerText = cityName;
        currentCity = cityName; // Spremanje imena grada za buduće akcije

        condition.innerText = today.conditions;
        rain.innerText = "Perc - " + today.precip + "%";
        uvIndex.innerText = today.uvindex;
        windSpeed.innerText = today.windspeed;
        measureUvIndex(today.uvindex);
        mainIcon.src = getIcon(today.icon);
        changeBackground(today.icon);
        humidity.innerText = today.humidity + "%";
        updateHumidityStatus(today.humidity);
        visibilty.innerText = today.visibility;
        updateVisibiltyStatus(today.visibility);
        airQuality.innerText = today.winddir;
        updateAirQualityStatus(today.winddir);
        if (hourlyorWeek === "hourly") {
          updateForecast(data.days[0].hours, unit, "day");
        } else {
          updateForecast(data.days, unit, "week");
        }
        sunRise.innerText = covertTimeTo12HourFormat(today.sunrise);
        sunSet.innerText = covertTimeTo12HourFormat(today.sunset);
      })
      .catch((err) => {
        alert("Grad nije pronađen u našoj bazi podataka.");
        console.error(err);
      });
}

// Ostatak funkcija (updateForecast, getIcon, itd.) ostaje isti...

function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let day = 0;
  let numCards = type === "day" ? 24 : 7;
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName = type === "week" ? getDayName(data[day].datetime) : getHour(data[day].datetime);
    let dayTemp = unit === "f" ? celciusToFahrenheit(data[day].temp) : data[day].temp;
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnitText = unit === "f" ? "°F" : "°C";
    card.innerHTML = `
      <h2 class="day-name">${dayName}</h2>
      <div class="card-icon">
        <img src="${iconSrc}" class="day-icon" alt="" />
      </div>
      <div class="day-temp">
        <h2 class="temp">${dayTemp}</h2>
        <span class="temp-unit">${tempUnitText}</span>
      </div>
    `;
    weatherCards.appendChild(card);
    day++;
  }
}

function getIcon(condition) {
  if (condition === "partly-cloudy-day") return "https://i.ibb.co/PZQXH8V/27.png";
  if (condition === "partly-cloudy-night") return "https://i.ibb.co/Kzkk59k/15.png";
  if (condition === "rain") return "https://i.ibb.co/kBd2NTS/39.png";
  if (condition === "clear-day") return "https://i.ibb.co/rb4rrJL/26.png";
  if (condition === "clear-night") return "https://i.ibb.co/1nxNGHL/10.png";
  return "https://i.ibb.co/rb4rrJL/26.png";
}

function changeBackground(condition) {
  const body = document.querySelector("body");
  let bg = "";
  if (condition === "partly-cloudy-day") bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
  else if (condition === "partly-cloudy-night") bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
  else if (condition === "rain") bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
  else if (condition === "clear-day") bg = "https://i.ibb.co/WGry01m/cd.jpg";
  else if (condition === "clear-night") bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
  else bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
  body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
}

function getHour(time) {
  let [hour, min] = time.split(":");
  if (hour > 12) return `${hour - 12}:${min} PM`;
  return `${hour}:${min} AM`;
}

function covertTimeTo12HourFormat(time) {
  let [hour, minute] = time.split(":");
  let ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  hour = hour ? hour : 12;
  hour = hour < 10 ? "0" + hour : hour;
  return hour + ":" + minute + " " + ampm;
}

function getDayName(date) {
  let day = new Date(date);
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day.getDay()];
}

function measureUvIndex(uvIndex) {
  if (uvIndex <= 2) uvText.innerText = "Low";
  else if (uvIndex <= 5) uvText.innerText = "Moderate";
  else if (uvIndex <= 7) uvText.innerText = "High";
  else if (uvIndex <= 10) uvText.innerText = "Very High";
  else uvText.innerText = "Extreme";
}

function updateHumidityStatus(humidity) {
  if (humidity <= 30) humidityStatus.innerText = "Low";
  else if (humidity <= 60) humidityStatus.innerText = "Moderate";
  else humidityStatus.innerText = "High";
}

function updateVisibiltyStatus(visibility) {
  if (visibility <= 0.03) visibilityStatus.innerText = "Dense Fog";
  else if (visibility <= 0.16) visibilityStatus.innerText = "Moderate Fog";
  else if (visibility <= 0.35) visibilityStatus.innerText = "Light Fog";
  else if (visibility <= 1.13) visibilityStatus.innerText = "Very Light Fog";
  else if (visibility <= 2.16) visibilityStatus.innerText = "Light Mist";
  else if (visibility <= 5.4) visibilityStatus.innerText = "Very Light Mist";
  else if (visibility <= 10.8) visibilityStatus.innerText = "Clear Air";
  else visibilityStatus.innerText = "Very Clear Air";
}

function updateAirQualityStatus(airquality) {
  if (airquality <= 50) airQualityStatus.innerText = "Good👌";
  else if (airquality <= 100) airQualityStatus.innerText = "Moderate😐";
  else if (airquality <= 150) airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
  else if (airquality <= 200) airQualityStatus.innerText = "Unhealthy😷";
  else if (airquality <= 250) airQualityStatus.innerText = "Very Unhealthy😨";
  else airQualityStatus.innerText = "Hazardous😱";
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let location = search.value;
  if (location) {
    getWeatherData(location, currentUnit, hourlyorWeek);
    removeSuggestions(); // Očisti sugestije nakon pretrage
  }
});

function celciusToFahrenheit(temp) {
  return ((temp * 9) / 5 + 32).toFixed(1);
}


// =================================================================== //
// ===== KOD ZA PREDIKTIVNO PRETRAŽIVANJE (AUTOCOMPLETE) POČINJE OVDJE ===== //
// =================================================================== //

var currentFocus;
search.addEventListener("input", function (e) {
  removeSuggestions();
  var a, b, i, val = this.value;
  if (!val) {
    return false;
  }
  currentFocus = -1;

  a = document.createElement("ul");
  a.setAttribute("id", "suggestions");

  this.parentNode.appendChild(a);

  // Provjera da li postoji 'cities' varijabla
  if (typeof cities !== 'undefined') {
    for (i = 0; i < cities.length; i++) {
      /* Provjerava da li ime grada počinje s unesenim tekstom */
      if (
          cities[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()
      ) {
        /* Kreira LI element za svaki pronađeni grad */
        b = document.createElement("li");
        /* PODEBLJAVA dio koji se poklapa */
        b.innerHTML = "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
        b.innerHTML += cities[i].name.substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + cities[i].name + "'>";

        /* Dodaje event listener za klik na sugestiju */
        b.addEventListener("click", function (e) {
          search.value = this.getElementsByTagName("input")[0].value;
          // Automatski pokreni pretragu kad se klikne na grad
          searchForm.dispatchEvent(new Event('submit'));
          removeSuggestions();
        });

        a.appendChild(b);
      }
    }
  }
});

/* Funkcija za upravljanje tipkovnicom (strelice i Enter) */
search.addEventListener("keydown", function (e) {
  var x = document.getElementById("suggestions");
  if (x) x = x.getElementsByTagName("li");
  if (e.keyCode == 40) { // Strelica DOLJE
    currentFocus++;
    addActive(x);
  } else if (e.keyCode == 38) { // Strelica GORE
    currentFocus--;
    addActive(x);
  }
  if (e.keyCode == 13) { // ENTER
    e.preventDefault();
    if (currentFocus > -1) {
      if (x) x[currentFocus].click();
    }
  }
});

function addActive(x) {
  if (!x) return false;
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = x.length - 1;
  x[currentFocus].classList.add("active");
}

function removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("active");
  }
}

function removeSuggestions() {
  var x = document.getElementById("suggestions");
  if (x) x.parentNode.removeChild(x);
}

// =================================================================== //
// =================== KRAJ KODA ZA PRETRAŽIVANJE ==================== //
// =================================================================== //


fahrenheitBtn.addEventListener("click", () => {
  changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
  changeUnit("c");
});

function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    tempUnit.forEach((elem) => {
      elem.innerText = `°${unit.toUpperCase()}`;
    });
    if (unit === "c") {
      celciusBtn.classList.add("active");
      fahrenheitBtn.classList.remove("active");
    } else {
      celciusBtn.classList.remove("active");
      fahrenheitBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

hourlyBtn.addEventListener("click", () => {
  changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
  changeTimeSpan("week");
});

function changeTimeSpan(unit) {
  if (hourlyorWeek !== unit) {
    hourlyorWeek = unit;
    if (unit === "hourly") {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    } else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}