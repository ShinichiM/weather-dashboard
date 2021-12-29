// TO DO
// Add Cards to 5 day weather forecast
// Add Card to current day forecast
// Add card to recent searches

// Global Variables
var formEl = document.getElementById("city-search");
var currentForecastEl = document.getElementById("current-forecast");
var fiveDayForecastEl = document.getElementById("five-day-forecast");
var searchButtonEl = document.getElementById("city-search");
var cityTextEl = document.getElementById("city");
var searchHistoryEl = document.getElementById("search-history");

var citySearches = new Array();

var currentDate = moment().format("MM/DD/YYYY");
var apiKey = "08de60513f8aaba79d4697d19640606f";
var isFivedayForecast = false;

// find maximum temperature of time block and return its index
var findMaxTemp = function (arr) {
    var maxTempIndex = 0;
    var holdTemp = arr[0].main.temp;

    for (let i = 1; i < arr.length; i++) {
        if (parseInt(arr[i].main.temp) > parseInt(holdTemp)) {
            maxTempIndex = i;
        }
    }
    return maxTempIndex;
};

// finds the ending index of each dat for the 5 forecast 
var findDateArr = function (array) {
    var fiveDayArr = [
        moment().add(1, 'days').format("YYYY-MM-DD"),
        moment().add(2, 'days').format("YYYY-MM-DD"),
        moment().add(3, 'days').format("YYYY-MM-DD"),
        moment().add(4, 'days').format("YYYY-MM-DD"),
        moment().add(5, 'days').format("YYYY-MM-DD")
    ];

    var dateIndex = new Array(5).fill(0);

    for (let i = 0; i < array.length; i++) {

        if (array[i].dt_txt.split(" ")[0] === fiveDayArr[0]) {
            dateIndex[0] = i;
        } else if (array[i].dt_txt.split(" ")[0] === fiveDayArr[1]) {
            dateIndex[1] = i;
        } else if (array[i].dt_txt.split(" ")[0] === fiveDayArr[2]) {
            dateIndex[2] = i;
        } else if (array[i].dt_txt.split(" ")[0] === fiveDayArr[3]) {
            dateIndex[3] = i;
        } else {
            dateIndex[4] = i;
        }
    }
    return (dateIndex);
};

// Locate 5 day forecast from weather object
var parseForecast = function (obj) {

    // obj.list returns large array of 5 day forecasts with 3 hour time blocks.
    var futureForecastArr = obj.list;

    // Get ending index for each day for the five day forecast.
    var datesLastIndex = findDateArr(futureForecastArr);
    var maxTempArr = new Array();

    // variable to store starting index to slice weather list from object.
    var start = 0;

    // loop through array containing the ending indices for each day (5 day sub-set of futureForecastArr)
    for (let i = 0; i < datesLastIndex.length; i++) {
        // If it is the first day
        if (i === 0) {
            maxTempIndex = findMaxTemp(futureForecastArr.slice(start, datesLastIndex[i] + 1));
            maxTempArr
                .push(
                    {   // dt_txt attribute for date, returns string
                        date: moment(futureForecastArr[maxTempIndex].dt_txt).format("MM/DD/YYYY"),
                        icon: futureForecastArr[maxTempIndex].weather[0].icon,
                        temp: futureForecastArr[maxTempIndex].main.temp,
                        wind: futureForecastArr[maxTempIndex].wind.speed,
                        humidity: futureForecastArr[maxTempIndex].main.humidity
                    });
        } else {
            // slice will return an array from [start, index - 1]
            // Add last index of array to index, for grabbing data in obj.list
            maxTempIndex = findMaxTemp(futureForecastArr.slice(start, datesLastIndex[i] + 1)) + datesLastIndex[i - 1];

            maxTempArr
                .push(
                    {   // dt_txt attribute for date, returns string
                        date: moment(futureForecastArr[maxTempIndex].dt_txt).format("M/DD/YYYY"),
                        icon: futureForecastArr[maxTempIndex].weather[0].icon,
                        temp: futureForecastArr[maxTempIndex].main.temp,
                        wind: futureForecastArr[maxTempIndex].wind.speed,
                        humidity: futureForecastArr[maxTempIndex].main.humidity
                    });
        }
        // set start to current Index + 1, start of new subset of Array.
        start = datesLastIndex[i] + 1;
    }
    return (maxTempArr);
};

var uvIndexSeverity = function (uvIndex) {
    let severity = "";

    if (uvIndex <= 2) {
        severity = 'success';
    } else if (uvIndex > 2 && uvIndex <= 5) {
        severity = 'warning';
    } else if (uvIndex > 5) {
        severity = 'danger'
    }
    return severity;
};

// creates the HTML elements to display current day forecast, or individual forecast for the 5 day forecast week.
var createCurrentDayForecast = function (obj, container, isFiveDayForecast) {
    // Units for weather attribute
    var units = {
        temp: "\u00B0F",
        wind: "MPH",
        humidity: "%"
    };

    // Get an array of keys stored in the object
    let iterator = Object.keys(obj);

    // Loop through keys
    for (const key of iterator) {
        if (!isFiveDayForecast) {
            if (key === "city") {
                var holdEl = document.createElement("h3");
                holdEl.setAttribute("id", "current-city-weather")
                holdEl.textContent = obj[key] + " (" + currentDate + ")";
                container.appendChild(holdEl);
            } else if (key === "icon") {
                var holdEl = document.getElementById("current-city-weather");
                var iconCode = obj[key];
                var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
                holdEl.insertAdjacentHTML("beforeend", "<img src='" + iconUrl + "'/>");
            } else if (key === "uv") {
                var holdEl = document.createElement("p");
                var holdUV = document.createElement("span");
                holdEl.textContent = key.toUpperCase() + " Index: ";
                holdUV.textContent = obj[key];
                holdUV.setAttribute("class", "bg-" + uvIndexSeverity(obj[key]) + " rounded px-2 text-white")
                holdEl.insertAdjacentElement("beforeend", holdUV);
                container.appendChild(holdEl);
            } else {
                var holdEl = document.createElement("p");
                holdEl.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + obj[key] + " " + units[key];
                container.appendChild(holdEl);
            }
        } else {
            if (key === "date") {
                var holdEl = document.createElement("h5");
                // holdEl.setAttribute("class", "")
                holdEl.textContent = obj[key];
                holdEl.setAttribute("class", "fw-bold");
                container.appendChild(holdEl);
            } else if (key === "uv") {
                var holdEl = document.createElement("p");
                holdEl.textContent = key.toUpperCase() + ": " + obj[key];
                container.appendChild(holdEl);
            } else if (key === "icon") {
                var holdEl = document.createElement("img");
                let iconCode = obj[key];
                let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
                holdEl.setAttribute("src", iconUrl);
                container.appendChild(holdEl);
            } else {
                var holdEl = document.createElement("p");
                holdEl.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + obj[key] + " " + units[key];
                container.appendChild(holdEl);
            }
            container.setAttribute("class", "bg-dark bg-gradient rounded");
            container.setAttribute("style", "--bs-bg-opacity: .85")
            holdEl.setAttribute("class", "text-white fw-bold small-font-size")
        }
    }
};

var displaySearch = function (cityName) {
    let searchEl = document.createElement("button");
    searchEl.textContent = cityName;
    searchEl.setAttribute("class", "d-block w-100 bg-secondary bg-gradient my-3 rounded text-center");
    searchEl.setAttribute("style", "--bs-bg-opacity: .5")
    searchHistoryEl.appendChild(searchEl);

    // listen to clicks on previous searches and trigger a "search click"
    searchEl.addEventListener("click", function (e) {
        cityTextEl.value = cityName;
        $("#search").trigger("click");
   });
};

// load previous searches from local storage and update citySearches array.
var loadSearches = function () {
    var previousCitySearches = JSON.parse(localStorage.getItem("weather"));

    if (previousCitySearches) {
        // let holdCity = previousCitySearches[0];
        for (let i = 0; i < previousCitySearches.length; i++) {
            citySearches.push(previousCitySearches[i]);
        }
    } else {
        return
    }
    previousCitySearches.forEach(element => displaySearch(element)); 
};

// save searches to local storage.
var saveSearches = function (cityName) {
    for (let index = 0; index < citySearches.length; index++) {
        if (citySearches[index] == cityName) {
            return
        }
    }
    citySearches.push(cityName);
    localStorage.setItem("weather", JSON.stringify(citySearches));
};

var createFiveDayForecast = function (arrayOfObjects) {
    // length of arrayOfObjects same length as number of children of fiveDayForecastEl
    let i = 0;
    isFiveDayForecast = true;

    $(fiveDayForecastEl.children).each(function () {
        createCurrentDayForecast(arrayOfObjects[i], $(this).find("#forecast")[0], isFiveDayForecast);
        i++;
    });
};

var removeForecast = function () {
    $("#current-forecast").children().each(function () {
        $(this).remove();
    })

    $("#five-day-forecast").children().each(function () {
        ($(this).find("#forecast").children().remove());
    });
};

// capitalize each string passed through function
var parseCityName = function (string) {
    if (!string) {return false}

    var holdArr = string.split(" ");
    var holdStr = "";

    for (let i=0; i<holdArr.length; i++) {
        var firstCharCap = holdArr[i][0].toUpperCase();
        holdArr[i] = firstCharCap.concat(holdArr[i].substring(1));
        if (!(i === holdArr.length-1)) {
            holdStr = holdStr.concat(holdArr[i], " ");
        } else {
            holdStr = holdStr.concat(holdArr[i]);
        }
    }
    return(holdStr);
};


var startDisplayForecast = function (event) {
    event.preventDefault();

    removeForecast();

    var cityName = parseCityName(cityTextEl.value); 
    // url to get current weather data
    var url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    fetch(url1)
        .then(response => response.json())
        .then(data => {
            // latitude and longitude for later usage
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            currentWeather = {
                city: cityName,
                temp: data.main.temp,
                wind: data.wind.speed,
                humidity: data.main.humidity,
                icon: data.weather[0].icon
            };

            // url for UV index
            var url2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=none" + "&appid=" + apiKey;

            // get uv index and create current forecast elements
            fetch(url2)
                .then(response => response.json())
                .then(data => {
                    Object.assign(currentWeather, { uv: data.current.uvi });
                    createCurrentDayForecast(currentWeather, currentForecastEl);
                });

            // url for 5 day forecast
            var url3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

            // get 5 day forecast
            fetch(url3)
                .then(response => response.json())
                .then(data => {
                    let fiveDayForecast = parseForecast(data);

                    // Update 5-day forecast cards
                    createFiveDayForecast(fiveDayForecast);
                });
            if (citySearches.filter(element => element === cityName).length === 0) {displaySearch(cityName)};
            saveSearches(cityName);
            cityTextEl.value = "";
        }).catch((error) => {
            if (error) {
                alert("That search criteria is invalid, please try again...");
            }
        });
};

loadSearches();

// Event listener for form submits
searchButtonEl.addEventListener("submit", startDisplayForecast);


// console.log(Object.keys(data).length); if (typeof Object.keys(data) == undefined || typeof Object.keys(data) == null) { console.log("Please work man") };