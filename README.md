# WeatherApp
Simple application to show the weather of different locations. Local time is shown, and you can see the temperature in Fahrenheit if you click on the temperature degree.<br>
<br>
<br>
<img src="./images/screenshot1.png" width="500" alt="screenshot1">
<img src="./images/screenshot2.png" width="500" alt="screenshot2">

### Configs
The app implements *OpenWeatherAPI*, to get your own API key, go to: https://openweathermap.org<br>
Create file ```env.js``` under "scripts" folder.
```
define([], function(){
    return {
        api_key: <your_api_key>
    };
});
```

### To run app:
Open the ```index.html``` file, and the app will start running in a the browser.
