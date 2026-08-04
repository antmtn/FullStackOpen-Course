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

const CountryDisplay = ({countries, buttonHandler}) => {
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
    return <SingularCountry country = {countries[0]}/>
  } else{
    return <div>No matches, specify another filter</div>
  }
}

const SingularCountry = ({country}) => {
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
    </div>
  )
}

const App = () => {
  const[country, setCountry] = useState('')
  const[allCountries, setAllCountries] = useState([])
  const[filter, setFilter] = useState('')
  const countryInputHandler = (event) => {
    setCountry(event.target.value)
  }

  const countrySubmitHandler = () => {
    event.preventDefault()
    setFilter(country)
  }

  const countryButtonHandler = (countryName) => {
    setFilter(countryName)
    setCountry('')
  }

  useEffect(() => {
    CountryService.allCountries().then((response => setAllCountries(response)))
  }, [])

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
      />
    </div>
  )
}

export default App