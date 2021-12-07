// Listen to 
var formEl = document.getElementById("city-search");
var currentForecastEl = document.getElementById("current-forecast");
var fiveDayForecastEl = document.getElementById("five-day-forecast");
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

var findDateArr = function(arr) {
    var fiveDayArr = [
        moment().add(1, 'days').format("YYYY-MM-DD"),
        moment().add(2, 'days').format("YYYY-MM-DD"),
        moment().add(3, 'days').format("YYYY-MM-DD"),
        moment().add(4, 'days').format("YYYY-MM-DD"),
        moment().add(5, 'days').format("YYYY-MM-DD")
    ];

    var dateIndex = new Array(5).fill(0);
    
    for (let i=0; i<arr.length; i++) {

        if (arr[i].dt_txt.split(" ")[0] === fiveDayArr[0]) {
            dateIndex[0] = i;
        } else if (arr[i].dt_txt.split(" ")[0] === fiveDayArr[1]) {
            dateIndex[1] = i;
        } else if (arr[i].dt_txt.split(" ")[0] === fiveDayArr[2]) {
            dateIndex[2] = i;
        } else if (arr[i].dt_txt.split(" ")[0] === fiveDayArr[3]) {
            dateIndex[3] = i;
        } else {
            dateIndex[4] = i;
        }
    }
    return(dateIndex);
};

// Locate 5 day forecast from weather object
var parseForecast = function(obj){

    var futureForecastArr = obj.list;
    var dateIndex = findDateArr(futureForecastArr);

    var maxTempArr = new Array();
    var start = 0;
    for (let i=0; i<dateIndex.length; i++) {
        if (i === 0) {
            maxTempIndex = findMaxTemp(futureForecastArr.slice(start, dateIndex[i]+1));
            maxTempArr
            .push(
                {
                    date: moment(futureForecastArr[maxTempIndex].dt_txt).format("M/DD/YYYY"),
                    temp: futureForecastArr[maxTempIndex].main.temp,
                    wind: futureForecastArr[maxTempIndex].wind.speed,
                    humidity: futureForecastArr[maxTempIndex].main.humidity
                });
        } else {
            maxTempIndex = findMaxTemp(futureForecastArr.slice(start, dateIndex[i]+1)) + dateIndex[i-1];
            maxTempArr
            .push(
            {
                date: moment(futureForecastArr[maxTempIndex].dt_txt).format("M/DD/YYYY"),
                temp: futureForecastArr[maxTempIndex].main.temp,
                wind: futureForecastArr[maxTempIndex].wind.speed,
                humidity: futureForecastArr[maxTempIndex].main.humidity
            });
        }
        start = dateIndex[i]+1;
    }
    return(maxTempArr);
};

// creates the HTML elements to display current day forecast
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

var createFiveDayForecast = function(arr) {
    let i=0;

    $(fiveDayForecastEl.children).each(function() {
        let futureDate = document.createElement("h5");
        let futureTemp = document.createElement("p");
        let futureWind = document.createElement("p");
        let futureHum = document.createElement("p");

        // console.log($(this).find("#forecast"));

        futureDate.textContent = arr[i].date;
        futureTemp.textContent = "Temp: " + arr[i].temp;
        futureWind.textContent = "Wind: " + arr[i].wind;
        futureHum.textContent = "Humidity: " + arr[i].humidity;

        $(this).find("#forecast").append(futureDate);
        $(this).find("#forecast").append(futureTemp);
        $(this).find("#forecast").append(futureWind);
        $(this).find("#forecast").append(futureHum);

        i++; 
    });
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
            humidity: data.main.humidity
        };
    
        // url for UV index
        var url2 = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&exclude=none" + "&appid=" + apiKey;
    
        // get uv index and create current forecast elements
        fetch(url2)
        .then(response => response.json())
        .then(data => {
            Object.assign(currentWeather, {uv: data.current.uvi});
            createCurrentForecast(currentWeather, currentForecastEl);
        });

    // url for 5 day forecast
    var url3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
    
    // get 5 day forecast
    fetch(url3)
    .then(response => response.json())
    .then(data => {
        let fiveDayForecast = parseForecast(data);
        // console.log(fiveDayForecastEl.children);

        // Update 5-day forecast cards
        createFiveDayForecast(fiveDayForecast);
    });
});