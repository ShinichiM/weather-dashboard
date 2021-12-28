# Weather Dashboard
## Overview
The weather dashboard is an application that provides users with current and future weather forecasts for any city. By using web APIs from [OpenWeatherMap](https://openweathermap.org/) the dashboard gives you accurate temperature readings up to 1% of a degree (Fahrenheit/Celcius/Kelvin) along with wind speeds, humidity, and UV indices. 

## Key Technologies 
- Moment.js
- Bootstrap
- Jquery
- Javascript

## Key Notes
- The weather dashboard pulls data from a singular source, (https://openweathermap.org/api),
with standard JavaScript fetch logic such as below. 

```js
  fetch(url)
  .then(response => response.json())
  .then(data => {'Do something with Data'})
  .catch(err => {'Do something with Error'})
```

- OpenWeatherMap contains multiple [API endpoints](https://openweathermap.org/api) to obtain weather data. 

In this application we have used the {Current Weather Data}, {One Call API}, and {5 Day / 3 Hour Forecast} APIs. One Call API is used to obtain UV Indices of each city.

- All current weather attributes are stored in objects returned by the API call and consolidated into a single data point in the applicaiton. This is stored in a variable ```currentWeather```
```js
 currentWeather = {
                city: cityName.city,
                temp: data.main.temp,
                wind: data.wind.speed,
                humidity: data.main.humidity,
                icon: data.weather[0].icon
            };
```

- To obtain UV Indices from {One Call API} we need Latitude and Longitude coordinates of the city that a user inputs. We get these inputs from the {Current Weather API} with ``` data.coord.lat and data.coord.lon ```

### Issues and Problems
- 5 day forecast data is returned in large arrays containing chunks of data, 5 days spread evenly in 3 hour time blocks. As such we need a method to select how we can manipulate the data to give an accurate forecast.

We have decided to parse through the raw 5 day forecast data and selected entries with the maximum temperature to represent that day's forecast. We could have also taken the average of all the weather attributes for each block (day) of data. We decided it's best to prepare for the worst and hope for the best!


## Deployment
A final working prototype of the dashboard is available here: [Weather Dashboard](https://shinichim.github.io/weather-dashboard/)
Search for as many cities as you want! It will save your history as you go along :)


<img width="957" alt="image" src="https://user-images.githubusercontent.com/62361626/145690237-d5ddcdef-80e8-4dcf-8f50-48d5c4025a0a.png">
