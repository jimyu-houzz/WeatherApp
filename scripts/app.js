

window.addEventListener("load", () => {
    let lon;
    let lat;
    let geoAccessible = false;
    let allowGeo = false
    let api;
    let apiKey;

    // using requirejs to get API_KEY from another file
    requirejs(['env'], (env) => {
        apiKey = env.api_key;
    })

    // get coordinates while window loads
    requestGeoPermission();
    


    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationCity = document.querySelector('.location-city');
    let temperatureSection = document.querySelector('.temperature-section');
    let temperatureSpan = document.querySelector('.temperature-span');
    // variables for other locations
    let currentCity = '';
    let otherLocations = document.querySelectorAll('p', '.other-location');

    // create a dictionary like object to store the fetched data
    let weatherData = {};


    // set Sydney as the default location
    getLocationWeather('Sydney');
    // set event listeners for different locations
    for (let loc of otherLocations) {
        loc.addEventListener('click', () => {
            getLocationWeather(loc.textContent);
        })
    }

    // change between fahrenheit and celcius
    temperatureSection.addEventListener('click', () => {
        changeDegreeUnit(temperatureDegree.textContent, temperatureSpan.textContent);
    })

    
    /* Uses geolocation to fetch weather for current location */
    function getLocationWeather(location){
        if (location !== currentCity){ // prevent duplicate fetches for same location
            if (location === 'Current Location'){
                // if geolocation is accessible
                if (geoAccessible) {
                    api = `http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
                }else{
                    alert("Geolocaion cannot be accessed from this browser. Please try another one or refresh page.")
                }
            } else { // fecth for cities
                api = `http://api.openweathermap.org/data/2.5/weather?units=metric&q=${location}&appid=11ed2c940b5999151b55830352c75b71`;
            }
            console.log("prepare to fetch: ", api);
            // only fetch data for new location
            if (!(location in weatherData)){
                console.log('ready to fetch')
                fetch(api)
                .then(result => result.json())
                .then(data => {
                    console.log("data", data);
                    parseHTML(data);
                })
            }else{
                console.log('we did not fetch here')
                parseHTML(weatherData[location]);
            }         
        }        
    }

    
    
    function setIcons(iconID){
        const url = 'http://openweathermap.org/img/wn/' + iconID + '@2x.png';
        document.getElementById("icon").setAttribute("src", url);
    }

    function parseHTML(data){
        const description = data.weather[0].description;
        const city = data.name;
        const degree = data.main.temp;
        const icon = data.weather[0].icon;
        setIcons(icon);
        temperatureDescription.textContent = description;
        temperatureDegree.textContent = degree;
        locationCity.textContent = city;

        // set currentCity
        currentCity = city 
        // store fetched data to dictionary
        weatherData[currentCity] = data;

        console.log('weather data: ', weatherData);    
    }

    function changeDegreeUnit(degree, mode){
        let num;
        if (mode === "C"){
            num = (degree * 1.8) + 32;
            console.log("degree", degree, "num", num);
            // round numbers to 1 decimal
            num = Math.round(num * 10) / 10;
            temperatureDegree.textContent = num;
            temperatureSpan.textContent = "F";
        }else{
            num = (degree - 32) * 0.556;
            num = Math.round(num * 10) / 10;
            temperatureDegree.textContent = num;
            temperatureSpan.textContent = "C";
        }        
    }

    function requestGeoPermission(){
        if(confirm("CLick \"OK\" to allow geoloaction to get weather for current location.")){
            getCoordinates();
            allowGeo = true;
        }
    }

    function getCoordinates(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log('geocoordinates: ', position);
                lon = position.coords.longitude;
                lat = position.coords.latitude;
                geoAccessible = true; // set attribute to true
            }, err => { // show error message
                console.log(err);
                alert(err.message);
            })        
        }
    }
})