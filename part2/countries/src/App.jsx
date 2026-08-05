import { useEffect, useState } from "react"
import CountryService from './services/Countries'

const CountryFinder = (props) => {
  return (
    <div>
      <form onSubmit = {props.onSubmit}>
        find countries 
        <input value={props.country} onChange={props.onChange}/>
      </form>
    </div>
  )
}

const CountryDisplay = ({countries, buttonHandler, weatherHandler, weather, icon}) => {
  if (countries.length > 10){
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length>1){
    return countries.map(c => {
    return(
    <div key = {c.name.common}>
      {c.name.common} 
      <button onClick ={() => buttonHandler(c.name.common)}>Show</button>
    </div>
    )})
  } else if (countries.length ===1){
    return <SingularCountry 
            country = {countries[0]}
            weatherHandler = {weatherHandler}
            weather = {weather}
            icon = {icon}
            />
  } else{
    return <div>No matches, specify another filter</div>
  }
}

const SingularCountry = ({country, weatherHandler, weather, icon}) => {
  weatherHandler(country.capital)
  return(
    <div>
      <h1>{country.name.common}</h1>
      Capital {country.capital}
      <br/>
      Area {country.area}
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
      </ul>
      <img src={country.flags.png}/>
      <h2>Weather in {country.capital}</h2>
      { 
        weather?
        <div>
          Temperature {(weather.main.temp - 273.15).toFixed(2)} Celsius
          <br/>
          {/* FIX THIS!!!! */}
          <img src = {`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}/>
          <br/>
          Wind {weather.wind.speed} m/s
        </div>
        :null
      }
    </div>
  )
}

const App = () => {
  const[country, setCountry] = useState('')
  const[allCountries, setAllCountries] = useState([])
  const[filter, setFilter] = useState('')
  const[icon, setIcon] = useState(null)
  const countryInputHandler = (event) => {
    setCountry(event.target.value)
  }
  const[weather,setWeather] = useState(null)

  const countrySubmitHandler = () => {
    event.preventDefault()
    setFilter(country)
  }

  const countryButtonHandler = (countryName) => {
    setFilter(countryName)
    setCountry('')
  }

  const weatherHandler = (capitalCity) => {
    CountryService.capitalWeather(capitalCity).then((response)=>setWeather(response))
  }

  useEffect(() => {
    CountryService.allCountries().then((response => setAllCountries(response)))
  }, [])

  useEffect(() => {
    if(countriesToDisplay.length == 1){
      setIcon(null)
      let capitalCity = countriesToDisplay[0].capital
      CountryService.capitalWeather(capitalCity).then((response)=>{
        setWeather(response)
        CountryService.getIcon(response.weather[0].icon).then(response => setIcon(response))
      })
      
    }
  },[filter])

  let countriesToDisplay = []
  if (filter){
    countriesToDisplay = allCountries.filter(c => c.name.common.toLowerCase().includes(filter.toLowerCase()))
  }

  return (
    <div>
      Hi
      <CountryFinder country={country} onChange={countryInputHandler} onSubmit = {countrySubmitHandler}/>
      <CountryDisplay 
        countries = {countriesToDisplay}
        buttonHandler = {countryButtonHandler}
        weatherHandler = {weatherHandler}
        weather = {weather}
        icon = {icon}
      />
    </div>
  )
}

export default App