// Listen to 
var formEl = document.getElementById("city-search");
var forecastContainerEl = document.getElementById("current-forecast")
var currentDate = moment().format("DD/MM/YYYY");

var apiKey = "08de60513f8aaba79d4697d19640606f";

// Gets data from weather place {
//      Setup variable for APIs
//      API log console


// find maximum temperature of time block and return its index
var findMaxTemp = function(arr){
    var maxTempIndex = 0;
    var holdTemp = arr[0].main.temp;

    for (let i=0; i<arr.length; i++) {
        if (parseInt(arr[i].main.temp) > parseInt(holdTemp)) {
            maxTempIndex = i;
        }
    }
    return maxTempIndex;
};

// Locate 5 day forecast from weather object
var parseForecast = function(obj){
    var currentDate = moment().format("YYYY-MM-DD");
    var futureForecastArr = obj.list;

    var day1Index = findMaxTemp(futureForecastArr.slice(0,7));
    var day2Index = findMaxTemp(futureForecastArr.slice(8,15)) + 7;
    var day3Index = findMaxTemp(futureForecastArr.slice(16,23)) + 15;
    var day4Index = findMaxTemp(futureForecastArr.slice(24,31)) + 23;
    var day5Index = findMaxTemp(futureForecastArr.slice(32,39)) + 31;

    // loop thru array
    // find max temp of that day
    // find wind 
    // find humidity
    // return index
    return [day1Index, day2Index, day3Index, day4Index, day5Index];
};

var createCurrentForecast = function(obj, container) {
    var headEl = document.createElement("h3");
    var tempEl = document.createElement("div");
    var windEl = document.createElement("div");
    var humEl = document.createElement("div");
    var uvEl = document.createElement("div");

    headEl.textContent = cityName + " (" + currentDate + ")";
    tempEl.textContent = "Temp: " + obj.temp + " \u00B0F";
    windEl.textContent = "Wind: " + obj.wind + " MPH";
    humEl.textContent = "Humidity: " + obj.humidity + " %";
    uvEl.textContent = "UV Index: " + obj.uv;

    container.appendChild(headEl);
    container.appendChild(tempEl);
    container.appendChild(windEl);
    container.appendChild(humEl);
    container.appendChild(uvEl);
};

//add s in https when pushing to main branch
var cityName = "Columbus"
var url1 = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + apiKey + "&units=imperial";


fetch(url1)
.then(response => response.json())
.then(data => {
    // latitude and longitude for later usage
    var lat = data.coord.lat;
    var lon = data.coord.lon;

    // object to store current weather attributes
     currentWeather = {
        city: cityName,
        temp: data.main.temp,
        wind: data.wind.speed,
        humidity: data.main.humidity,
    };

    // url for 5 day forecast
    var url2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
    
    // get 5 day forecast
    fetch(url2)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        console.log(parseForecast(data));
    })

    // url for UV index
    var url3 = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&exclude=none" + "&appid=" + apiKey;

    // get uv index and create current forecast elements
    fetch(url3)
    .then(response => response.json())
    .then(data => {
        Object.assign(currentWeather, {uv: data.current.uvi});
        createCurrentForecast(currentWeather, forecastContainerEl);
    });
    // console.log(forecastContainerEl);
    // console.log(currentWeather)
    
    // createCurrentForecast(currentWeather, forecastContainerEl);
    // console.log(currentWeather.cityName)
});