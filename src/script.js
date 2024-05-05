// DOM elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const cityNameElement = document.getElementById('cityName');
const dateElement = document.getElementById('date');
const weatherIconElement = document.getElementById('weatherIcon');
const temperatureElement = document.getElementById('temperature');
const windSpeedElement = document.getElementById('windSpeed');
const humidityElement = document.getElementById('humidity');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const weatherDescriptionElement = document.getElementById('weatherDescription');
const forecastContainer = document.getElementById('forecastContainer');
const currentWeatherContainer = document.getElementById('current-weather');
const weatherDisplay = document.getElementById('weatherDisplay');
const citiesDatalist = document.getElementById('cities');

// Function to show the weather display
function showWeatherDisplay() {
    weatherDisplay.classList.remove('hidden');
}

// Function to clear the city input form
function clearForm() {
    cityInput.value = '';
}

// Function to validate the search input
function validateSearchInput(city) {
    if (!city.trim()) {
        alert("Please enter a city name.");
        return false;
    }
    return true;
}

// Function to add a city to the recent searches
function addToRecentSearches(city) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const lowercaseCity = city.toLowerCase();
    
    if (!recentSearches.includes(lowercaseCity)) {
        recentSearches.unshift(lowercaseCity);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
}

// Function to populate the datalist with recent searches
function populateDatalist() {
    citiesDatalist.innerHTML = '';
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearches.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        citiesDatalist.appendChild(option);
    });
}

// Function to handle errors
function handleError(error) {
    console.error('Error:', error);
    const errorMessage = error.message || 'An error occurred.';
    alert(errorMessage);
}

// Function to get the current position using Geolocation API
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

// Form submission event listener
searchForm.addEventListener('submit', async (event) => {
    // Prevent default form submission
    event.preventDefault(); 
    const city = cityInput.value.trim();
    if (!validateSearchInput(city)) {
        return;
    }
    clearForm();
    try {
        const weatherData = await getWeatherData(city);
        displayWeather(weatherData);
        addToRecentSearches(city);
        populateDatalist();
        const forecastData = await get5DayForecast(city);
        display5DayForecast(forecastData);
    } catch (error) {
        handleError(error);
        clearWeatherData();
        clear5DayForecast();
    }
});

// Current location button event listener
currentLocationBtn.addEventListener('click', async () => {
    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const weatherData = await getWeatherDataByCoords(latitude, longitude);
                displayWeather(weatherData);
                const forecastData = await get5DayForecastByCoords(latitude, longitude);
                display5DayForecast(forecastData);
                addToRecentSearches(cityInput.value);
                populateDatalist();
            }, (error) => {
                console.error('Error getting current location:', error);
                alert('Geolocation access was denied. Please enter a city manually.');
            });
        } else {
            throw new Error('Geolocation is not supported by this browser.');
        }
    } catch (error) {
        console.error('Error fetching weather data for current location:', error);
        clearWeatherData();
        clear5DayForecast();
        alert('Error fetching weather data for current location. Please try again later.');
    }
});

// Function to fetch weather data for the city
async function getWeatherData(city) {
    if (!city) {
        throw new Error('City name is required');
    }
    const API_KEY = 'f3af0388f65c8a87d4e325a233656263';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
        showWeatherDisplay();
        return data;
    } else {
        if (data.cod === '404') {
            throw new Error('City not found');
        } else {
            throw new Error(data.message || 'Failed to fetch weather data');
        }
    }
}

// Function to fetch weather data by coordinates
async function getWeatherDataByCoords(latitude, longitude) {
    const API_KEY = 'f3af0388f65c8a87d4e325a233656263';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    showWeatherDisplay();

    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || 'Failed to fetch weather data');
    }
}

// Function to fetch 5-day forecast data for the city
async function get5DayForecast(city) {
    const API_KEY = 'f3af0388f65c8a87d4e325a233656263';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || 'Failed to fetch forecast data');
    }
}

// Function to fetch 5-day forecast data by coordinates
async function get5DayForecastByCoords(latitude, longitude) {
    const API_KEY = 'f3af0388f65c8a87d4e325a233656263';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || 'Failed to fetch forecast data');
    }
}

// Function to display weather data
function displayWeather(weatherData) {
    const cityName = weatherData.name;
    const date = new Date().toLocaleDateString();
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    const temperature = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const weatherMain = weatherData.weather[0].main;

    cityNameElement.textContent = cityName;
    dateElement.textContent = date;
    weatherDescriptionElement.textContent = `Main Weather: ${weatherMain}`;
    weatherIconElement.src = iconUrl;
    temperatureElement.textContent = `Temperature: ${temperature}°C`;
    windSpeedElement.textContent = `Wind: ${windSpeed} m/s`;
    humidityElement.textContent = `Humidity: ${humidity}%`;
}

// Function to display 5-day forecast weather data
function display5DayForecast(forecastData) {
    forecastContainer.innerHTML = '';
    const forecasts = forecastData.list.filter((forecast, index) => index % 8 === 0);
    forecasts.forEach((forecast, index) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const temperature = forecast.main.temp;
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;
        const weatherMain = forecast.weather[0].main;
        const forecastCard = `
            <div class="current-weather bg-indigo-500 text-black p-4 rounded-lg">
                <h2 class="text-3xl lg:text-4xl font-bold mb-4">Day ${index + 1}</h2>
                <div class="details flex flex-col items-center">
                    <h6 class="text-2xl font-bold">${date}</h6>
                    <h6 class="font-bold">${weatherMain}</h6>
                    <img class="w-20 h-20 my-2" src="${iconUrl}" alt="Weather Icon">
                    <h6 class="text-1xl font-bold">Temperature: ${temperature}°C</h6>
                    <h6 class="text-1xl font-bold">Wind: ${windSpeed} m/s</h6>
                    <h6 class="text-1xl font-bold">Humidity: ${humidity}%</h6>
                </div>
            </div>
        `;
        forecastContainer.insertAdjacentHTML('beforeend', forecastCard);
    });
}

// Function to clear weather data
function clearWeatherData() {
    currentWeatherContainer.innerHTML = '';
}

// Function to clear 5-day forecast weather data
function clear5DayForecast() {
    forecastContainer.innerHTML = '';
}

// Call the function to populate recent searches
populateDatalist();

