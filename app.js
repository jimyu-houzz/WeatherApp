window.addEventListener("load", () => {
    let lon;
    let lat;
    let apiKey;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationCity = document.querySelector('.location-city');
    let temperatureSection = document.querySelector('.temperature-section');
    let temperatureSpan = document.querySelector('.temperature-span');
    // variables for other locations
    let currentCity = '';
    let otherLocations = document.querySelectorAll('p', '.other-location');

    
    // set event listeners for different locations
    for (let loc of otherLocations) {
        loc.addEventListener('click', () => {
            getCityWeather(loc.textContent);
        })
    }
    
    /* Uses geolocation to fetch weather for current location */
    function getCurrentLocationWeather(){
        // if geolocation is accessible
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log(position);
                lon = position.coords.longitude;
                lat = position.coords.latitude;
                apiKey = '11ed2c940b5999151b55830352c75b71';

                const api = `http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
                // const api = 'http://api.openweathermap.org/data/2.5/weather?units=metric&q=taipei&appid=11ed2c940b5999151b55830352c75b71';
                
                fetch(api)
                    .then(result => result.json())
                    .then(data => {
                        console.log("data", data);
                        const description = data.weather[0].description;
                        const city = data.name;
                        const degree = data.main.temp;
                        const icon = data.weather[0].icon;
                        setIcons(icon);
                        temperatureDescription.textContent = description;
                        temperatureDegree.textContent = degree;
                        locationCity.textContent = city;
                        currentCity = city
                        console.log("Icon ID: ", icon);

                        // change between fahrenheit and celcius
                        temperatureSection.addEventListener('click', () => {
                            if (temperatureSpan.textContent === "C") {
                                temperatureDegree.textContent = celciusToFahrenheit(degree);
                                temperatureSpan.textContent = "F";
                            }else{
                                temperatureDegree.textContent = degree;
                                temperatureSpan.textContent = "C";
                            }
                        })
                    })
            })        
        }
    }

    /* Get weather data from city */
    function getCityWeather(city){
        if (city !== currentCity){
            console.log("will change location");
            currentCity = city;
            if (city === 'Current Location'){
                getCurrentLocationWeather();
            }
        }
    }

    
    
        


    function setIcons(iconID){
        const url = 'http://openweathermap.org/img/wn/' + iconID + '@2x.png';
        document.getElementById("icon").setAttribute("src", url);
        console.log("URL for image", url);
    }

    function celciusToFahrenheit(degree){
        let num = (degree + 32) * 1.8;
        // round numbers to 1 decimal
        num = Math.round(num * 10) / 10;
        return num;
    }
})