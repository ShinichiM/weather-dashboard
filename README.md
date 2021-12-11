# Weather Dashboard
## Overview
The weather dashboard is your go-to platform to get the latest updates on current and future forecasted weather! 

The dashboard gives you accurate and current temperature readings up to a 1/100th of a degree (Fahrenheit) along with wind speeds (MPH), humidity (%), and UV indices. 

## Key Technologies 
- Moment.js
- Bootstrap
- Jquery
- Javascript

## Key Notes
```
- The weather dashboard pulls data from a singular source, (https://openweathermap.org/api),
with api fetch logic contained in areas below. 
```
<img width="713" alt="image" src="https://user-images.githubusercontent.com/62361626/145689830-b962bc39-7706-4418-b59c-df114dc682f2.png">

```
- Data are stored in objects that are then pushed into an array for later processing and data storing. 
- Source data is stored in large arrays containing weather data in 3 hour time blocks, as such we have
parsed through the data selecting entries with the maximum temperature for a given day. A snippet of
the logic is shown below.
```
<img width="769" alt="image" src="https://user-images.githubusercontent.com/62361626/145690045-8c525748-e116-4a93-ba85-79fe3bd8335d.png">

## Deployment
A final working prototype of the dashboard is available here: [Weather Dashboard](https://shinichim.github.io/weather-dashboard/)
Search for as many cities as you want! It will save your history as you go along :)


<img width="957" alt="image" src="https://user-images.githubusercontent.com/62361626/145690237-d5ddcdef-80e8-4dcf-8f50-48d5c4025a0a.png">
