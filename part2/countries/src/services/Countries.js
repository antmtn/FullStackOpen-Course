import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
const api_key = '&appid='+ import.meta.env.VITE_SOME_KEY

const allCountries = () =>{
  return axios.get(`${baseUrl}/all`).then(response => response.data)
}

const capitalWeather = (capitalCity) => {
  return axios.get(`${weatherUrl}${capitalCity}${api_key}`).then(response => response.data)
}

export default {
  allCountries,
  capitalWeather
}