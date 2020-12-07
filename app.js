

window.addEventListener("load", () => {
    let lon;
    let lat;
    let api;
    let apiKey;

    // using requirejs to get API_KEY from another file
    requirejs(['env'], (env) => {
        apiKey = env.api_key;
        console.log('apikey: ', apiKey);
    })


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
        changeDegreeUnit(degree, temperatureSpan.textContent);
    })

    
    /* Uses geolocation to fetch weather for current location */
    function getLocationWeather(location){
        if (location !== currentCity){ // prevent duplicate fetches for same location
            if (location === 'Current Location'){
                // if geolocation is accessible
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        console.log(position);
                        lon = position.coords.longitude;
                        lat = position.coords.latitude;
    
                        api = `http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
                    }, err => { // show error message
                        console.log(err);
                        alert(err.message);
                    })        
                }else{
                    alert("Geolocaion cannot be accessed from this browser. Please try another one.")
                }
            } else { // fecth for cities
                api = `http://api.openweathermap.org/data/2.5/weather?units=metric&q=${location}&appid=11ed2c940b5999151b55830352c75b71`;
            }
            
            // only fetch data for new location
            if (!(location in weatherData)){
                fetch(api)
                .then(result => result.json())
                .then(data => {
                    console.log("data", data);
                    parseHTML(data);
                })
            }else{
                parseHTML(weatherData[location]);
            }         
        }
        
    }

    
    
    function setIcons(iconID){
        const url = 'http://openweathermap.org/img/wn/' + iconID + '@2x.png';
        document.getElementById("icon").setAttribute("src", url);
        console.log("URL for image", url);
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

        console.log(weatherData);
        console.log(weatherData[currentCity]);       
    }

    function changeDegreeUnit(degree, mode){
        let num
        if (mode === "C"){
            num = (degree + 32) * 1.8;
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
})