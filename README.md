# Weather Dashboard

## Overview

This Weather Dashboard is a web/express application that allows users to retrieve and display current and future weather conditions for up to 5 days at 12:00PM for any given city. 
The application utilizes the 5 Day 3 hour Weather Forecast API from OpenWeatherMap to fetch weather data.


## Deployment

The deployed version can be accessed [here](https://borregaio.github.io/weather-app/).


## Technologies Used
- TypeScript
- NodeJS
- Vite
- NPM
- OpenWeatherMap API



## Usage

### Search for a City:

1. Enter the desired city name in the search bar.
2. Click the search button.

### Current Weather Conditions:

- Displays the following information:
  - Name of City
  - Date
  - Icon of weather conditions
  - Temperature
  - Humidity
  - Wind speed
  - Specifically at 12:00PM

### 5-Day Forecast:

- Presents a 5-day forecast with details for each day:
  - Date
  - Icon of weather conditions
  - Temperature
  - Humidity
  - Data is specifically at 12:00PM

### Search History:

- The searched city is added to the search history.
- Clicking on a city in the search history displays its current and future weather conditions.
- You are also able to delete past search history by clicking the red trash can!

## Getting Started

[For Cloning]
1. Clone the repository
    ```console
    git clone https://github.com/Eldrish-Ramos/node-openweather-dashboard
    ```
[For Usage]
1. visit:  https://node-openweather-dashboard.onrender.com/

Unfortunately I ran out of time and could not get the the proper deployment. Locally this works fine, on server this does not. Whatever points and credit I can get I will take. 
