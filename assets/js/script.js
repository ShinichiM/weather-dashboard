// Listen to 
var formEl = document.getElementById("city-search");
var currentForecastEl = document.getElementById("current-forecast");
var fiveDayForecastEl = document.getElementById("five-day-forecast");
var searchButtonEl  = document.getElementById("city-search");
var cityTextEl = document.getElementById("city");

var currentDate = moment().format("MM/DD/YYYY");
var apiKey = "08de60513f8aaba79d4697d19640606f";

// find maximum temperature of time block and return its index
var findMaxTemp = function(arr){
    var maxTempIndex = 0;
    var holdTemp = arr[0].main.temp;

    for (let i=1; i<arr.length; i++) {
        if (parseInt(arr[i].main.temp) > parseInt(holdTemp)) {
            maxTempIndex = i;
        }
    }
    return maxTempIndex;
};

// finds the ending index of each dat for the 5 forecast 
var findDateArr = function(array) {
    var fiveDayArr = [
        moment().add(1, 'days').format("YYYY-MM-DD"),
        moment().add(2, 'days').format("YYYY-MM-DD"),
        moment().add(3, 'days').format("YYYY-MM-DD"),
        moment().add(4, 'days').format("YYYY-MM-DD"),
        moment().add(5, 'days').format("YYYY-MM-DD")
    ];

    var dateIndex = new Array(5).fill(0);
    
    for (let i=0; i<array.length; i++) {

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
    return(dateIndex);
};

// Locate 5 day forecast from weather object
var parseForecast = function(obj){

    // obj.list returns large array of 5 day forecasts with 3 hour time blocks.
    var futureForecastArr = obj.list;

    // Get ending index for each day for the five day forecast.
    var datesLastIndex = findDateArr(futureForecastArr);
    var maxTempArr = new Array();

    // variable to store starting index to slice weather list from object.
    var start = 0;

    // loop through array containing the ending indices for each day (5 day sub-set of futureForecastArr)
    for (let i=0; i<datesLastIndex.length; i++) {
        // If it is the first day
        if (i === 0) {
            maxTempIndex = findMaxTemp(futureForecastArr.slice(start, datesLastIndex[i]+1));
            maxTempArr
            .push(
                {   // dt_txt attribute for date, returns string
                    date: moment(futureForecastArr[maxTempIndex].dt_txt).format("M/DD/YYYY"),
                    temp: futureForecastArr[maxTempIndex].main.temp,
                    wind: futureForecastArr[maxTempIndex].wind.speed,
                    humidity: futureForecastArr[maxTempIndex].main.humidity,
                    icon: futureForecastArr[maxTempIndex].weather[0].icon
                });
        } else {
            // slice will return an array from [start, index - 1]
            // Add last index of array to index, for grabbing data in obj.list
            maxTempIndex = findMaxTemp(futureForecastArr.slice(start, datesLastIndex[i]+1)) + datesLastIndex[i-1];

            maxTempArr
            .push(
            {   // dt_txt attribute for date, returns string
                date: moment(futureForecastArr[maxTempIndex].dt_txt).format("M/DD/YYYY"),
                temp: futureForecastArr[maxTempIndex].main.temp,
                wind: futureForecastArr[maxTempIndex].wind.speed,
                humidity: futureForecastArr[maxTempIndex].main.humidity,
                icon: futureForecastArr[maxTempIndex].weather[0].icon
            });
        }
        // set start to current Index + 1, start of new subset of Array.
        start = datesLastIndex[i]+1;
    }
    return(maxTempArr);
};

// creates the HTML elements to display current day forecast
var createCurrentDayForecast = function(obj, container) {
    var units = {
        temp: "\u00B0F",
        wind: "MPH",
        humidity: "%"
    };
    
    let iterator = Object.keys(obj);
    for (const key of iterator) {
        if (key === "city") {
            var holdEl = document.createElement("h3");
            holdEl.setAttribute("id", "current-city-weather")
            holdEl.textContent = obj[key]+ " ("+currentDate+")";
            container.appendChild(holdEl);
        } else if (key === "icon") {
            var holdEl = document.getElementById("current-city-weather");
            let iconCode = obj[key];
            let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            holdEl.insertAdjacentHTML("beforeend", "<img src='"+iconUrl+"'/>");
        } else {
            if (key === "uv") {
                var holdEl = document.createElement("p");
                holdEl.textContent = key.toUpperCase() + ": " + obj[key]; 
                container.appendChild(holdEl);
            } else {
                var holdEl = document.createElement("p");
                holdEl.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + obj[key] + " " + units[key]; 
                container.appendChild(holdEl);
            }
        }
    };
};

var createFiveDayForecast = function(arrayOfObjects) {
    let i=0;
    $(fiveDayForecastEl.children).each(function() {
        // console.log($(this).find("#forecast")[0])
        // createCurrentDayForecast(arrayOfObjects[i], $(this).find("#forecast")[0]);
        // for (let i=0; i<arrayOfObjects.length; i++) {
        //     if (arrayOfObjects[i].date)
        //     let holdEl = document.createElement("")
        // }
        // let iterator = Object.keys(arrayOfObjects[i]);
        // for (const key of iterator) {
        //     if (key === "date") {
        //         let holdEl = document.createElement("h5");
        //         holdEl.textContent = arrayOfObjects[i][key];
        //         $(this).find("#forecast").append(holdEl);
        //     } else if (key === "icon") {
                
        //     } else {
        //         let holdEl = document.createElement("p");
        //         holdEl.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + arrayOfObjects[i][key] + " " + units[key]; 
        //         $(this).find("#forecast").append(holdEl);
        //     }
        // }
        let futureDate = document.createElement("h5");
        let futureTemp = document.createElement("p");
        let futureWind = document.createElement("p");
        let futureHum = document.createElement("p");
        
        let futureIcon = document.createElement("img");
        let iconCode = arrayOfObjects[i].icon;
        let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
        
        futureIcon.setAttribute("src", iconUrl);
        futureDate.textContent = arrayOfObjects[i].date;
        futureTemp.textContent = "Temp: " + arrayOfObjects[i].temp + " \u00B0F";
        futureWind.textContent = "Wind: " + arrayOfObjects[i].wind + " MPH";
        futureHum.textContent = "Humidity: " + arrayOfObjects[i].humidity + "%";

        $(this).find("#forecast").append(futureDate);
        $(this).find("#forecast").append(futureIcon);
        $(this).find("#forecast").append(futureTemp);
        $(this).find("#forecast").append(futureWind);
        $(this).find("#forecast").append(futureHum);
    });
};

var removeForecast = function() {
    $("#current-forecast").children().each(function(){
        $(this).remove();
    })

    $("#five-day-forecast").children().each(function(){
        ($(this).find("#forecast").children().remove());
    });
};

var startDisplayForecast = function(event) {
    event.preventDefault();

    removeForecast();

    var cityName = cityTextEl.value;

    // url to get current weather data
    var url1 = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + apiKey + "&units=imperial";


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
        var url2 = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&exclude=none" + "&appid=" + apiKey;
    
        // get uv index and create current forecast elements
        fetch(url2)
        .then(response => response.json())
        .then(data => {
            Object.assign(currentWeather, {uv: data.current.uvi});
            createCurrentDayForecast(currentWeather, currentForecastEl);
        });

        // url for 5 day forecast
        var url3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

        // get 5 day forecast
        fetch(url3)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            let fiveDayForecast = parseForecast(data);
            // console.log(fiveDayForecast)
            
            // Update 5-day forecast cards
            createFiveDayForecast(fiveDayForecast);
        });
    });
};

// Add Event Listener to form submits
searchButtonEl.addEventListener("submit", startDisplayForecast);