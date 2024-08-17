const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.querySelector('#locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const timeOutput = document.querySelector('.time');

let cityInput = 'Navsari';

// Add click event to each city in the panel
cities.forEach(city => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = '0';
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
   
    if (search.value.length === 0) {
        alert('Please type a city name');
    } else {
        cityInput = search.value;
        fetchWeatherData();
        search.value = ""; // Remove all text from input field
        app.style.opacity = "0";
    }
});

function dayOfTheWeek(day, month, year) {
    const weekday = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

function fetchWeatherData() {
    const apiKey = '625955393cb322ec2346b0962166793d'; // Replace with your OpenWeatherMap API key

    if (!cityInput) {
        alert('City input is missing');
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityInput)}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod !== 200) { // Check if the city is found
                throw new Error(`API error: ${data.message}`);
            }

            // Update UI elements
            temp.innerHTML = data.main.temp + "&#176;";
            conditionOutput.innerHTML = data.weather[0].description;
            nameOutput.innerHTML = data.name;

            const date = new Date();
            const y = date.getFullYear();
            const m = date.getMonth() + 1; // Months are zero-indexed
            const d = date.getDate();
            const time = date.toTimeString().split(' ')[0];

            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)}, ${d}/${m}/${y}`;
            timeOutput.innerHTML = time;

            const iconID = data.weather[0].icon;
            icon.src = `http://openweathermap.org/img/wn/${iconID}@2x.png`;

            humidityOutput.innerHTML = data.main.humidity + "%";
            windOutput.innerHTML = data.wind.speed + " km/h";

            // Determine time of day
            const currentHour = date.getHours();
            let timeOfDay = "day";
            if (currentHour < 6 || currentHour >= 18) {
                timeOfDay = "night";
            } else if (currentHour >= 6 && currentHour < 12) {
                timeOfDay = "morning";
            } else if (currentHour >= 12 && currentHour < 18) {
                timeOfDay = "afternoon";
            }

            // Debugging logs
            console.log(`Time of day: ${timeOfDay}`);
            const code = data.weather[0].id;
            console.log(`Weather code: ${code}`);

            // Update background image based on weather conditions and time of day
            let bgImageUrl = "";
            let btnBgColor = "";

            if (code === 800) { // Clear
                bgImageUrl = timeOfDay === "morning" ? 'https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : 'https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                btnBgColor = timeOfDay === "night" ? "#181e27" : "#e5ba92";
            } else if ([801, 802, 803, 804].includes(code)) { // Clouds
                bgImageUrl = 'https://images.unsplash.com/photo-1476673160081-cf065607f449?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                btnBgColor = timeOfDay === "morning" ? "#181e27" : "#fa6d1b";
            } else if ([200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531].includes(code)) { // Rain, Drizzle, Snow
                bgImageUrl = 'https://images.unsplash.com/photo-1476673160081-cf065607f449?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                btnBgColor = timeOfDay === "night" ? "#325c80" : "#647d75";
            } else { // Default or other weather types
                bgImageUrl = 'https://images.unsplash.com/photo-1528353518104-dbd48bee7bc4?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                btnBgColor = timeOfDay === "afternoon" ? "#325c80" : "#4d72aa";
            }

            // Log URL and background update
            console.log(`Background Image URL: ${bgImageUrl}`);
            app.style.backgroundImage = `url(${bgImageUrl})`;
            btn.style.background = btnBgColor;

            app.style.opacity = "1";
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('City not found, please try again');
            app.style.opacity = "1";
        });
}




