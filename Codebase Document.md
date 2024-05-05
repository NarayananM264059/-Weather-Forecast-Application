# Weather Forecast Application Documentation

## Overview
This document provides documentation for the Weather Forecast Application, which allows users to get current weather information and a 5-day forecast for a specific city. The application includes features for searching by city name, using the current location, and viewing recently searched cities.

## Usage

- Enter a city name in the search input field and click the "Search" button to retrieve weather data for that city.
- Click the "Current Location" button to get weather data based on your current location.
- The main weather display section will show the current weather conditions, including temperature, wind speed, and humidity, as well as a weather icon.
- The 5-day forecast section will display weather forecasts for the next 5 days, including temperature, wind speed, and humidity.
- Use the dropdown menu to access recently searched cities and quickly view their weather data.

## HTML Structure
The HTML structure of the application consists of the following key elements:
- Header: Displays the title of the application.
- Main Content: Contains the search form, weather display, and footer.
  - Search Form: Allows users to enter a city name or use the current location.
  - Weather Display: Displays current weather information and a 5-day forecast.
  - Footer: Displays the copyright information.

## JavaScript Functionality
The JavaScript file (`script.js`) contains the functionality for fetching weather data, handling user input, and updating the UI. The key functions and their purposes are outlined below:

### Key Functions:
1. `validateSearchInput(city)`: Validates the search input to ensure a city name is provided.
2. `getWeatherData(city)`: Fetches weather data for the specified city from the OpenWeatherMap API.
3. `getWeatherDataByCoords(latitude, longitude)`: Fetches weather data based on the user's coordinates.
4. `get5DayForecast(city)`: Fetches a 5-day forecast for the specified city.
5. `get5DayForecastByCoords(latitude, longitude)`: Fetches a 5-day forecast based on the user's coordinates.
6. `displayWeather(weatherData)`: Updates the UI with current weather data.
7. `display5DayForecast(forecastData)`: Updates the UI with a 5-day forecast.
8. `clearWeatherData()`: Clears the weather data displayed on the UI.
9. `clear5DayForecast()`: Clears the 5-day forecast displayed on the UI.

### Event Listeners:
- `searchForm.addEventListener('submit', ...)`: Listens for form submission events and fetches weather data based on user input.
- `currentLocationBtn.addEventListener('click', ...)`: Listens for clicks on the "Current Location" button and fetches weather data based on the user's current location.

## Error Handling
The application handles various errors, including invalid city names, geolocation denial, and network errors. Error messages are displayed to the user via alerts.

## User Interface
The UI is designed using Tailwind CSS for styling. It features a clean and responsive layout with elements for displaying weather data and interacting with the application.

## Credits
This application uses the OpenWeatherMap API to fetch weather data.

