import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/Persons'

const SearchFilter = (props) => {
  return(
    <div>
      filter shown with <input value={props.value} onChange={props.onChange}/>
    </div>
  )
}

const PersonForm = (props) => {
  return(
    <form onSubmit={props.onSubmit}>
        <div>
          name: <input value={props.newName} onChange={props.nameOnChange}/>
        </div>
        <div>
          number: <input value={props.newPhoneNumber} onChange={props.numberOnChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Person = (props) => <div>{props.person.name} {props.person.number}</div>
  

const PeopleDisplay = (props) => 
  props.people.map(p => (
    <Person key={p.name} person = {p}/>  
  ))

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [nameFilter, setNewNameFilter] = useState('')

  useEffect(() => {
    axios
    .get('http://localhost:3001/persons')
    .then(response =>{
      setPersons(response.data)
    })
  },[])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewPhoneNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNewNameFilter(event.target.value)
  }

  const handleNameSubmit = (event) => {
    event.preventDefault()
    const nameObject = {
      name : newName,
      number: newPhoneNumber
    }

    if (persons.some(p => p.name === newName)){
      alert(`${newName} is already added to phonebook`)
    }
    else{
      personService.create(nameObject)
                  .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                  })
    }
    setNewName('')
    setNewPhoneNumber('')
  }

  const peopleToShow = persons.filter(p => p.name.toLowerCase().includes(nameFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter value={nameFilter} onChange ={handleNameFilterChange}/>
      
      <h2>Add a New</h2>
      <PersonForm 
        onSubmit={handleNameSubmit}
        newName={newName}
        nameOnChange={handleNameChange}
        newPhoneNumber={newPhoneNumber}
        numberOnChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>
      <PeopleDisplay people={peopleToShow}/>
    </div>
  )
}

export default App