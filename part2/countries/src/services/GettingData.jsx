import axios from "axios";

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'
const all = 'api/all'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY
const getAll = () => {
    return (
        axios.get(baseUrl+all)
        .then(response => (response.data))
    );
}

const getByName = (name) => {
    return (
        axios.get(baseUrl + `api/name/${name}`)
        .then(response => (response.data))
    );
}

const getWeather = (city) => {
    return axios.get(weatherUrl, {
        params: {
            q: city,
            appid: apiKey,
            units: 'metric'
        }
    }).then(response => response.data);
}



export {getAll, getByName, getWeather}