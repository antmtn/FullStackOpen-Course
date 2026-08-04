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

const Person = (props) => <>{props.person.name} {props.person.number} </>
  

const PeopleDisplay = (props) => 
  props.people.map(p => (
    <div key ={p.name}>
      <Person person = {p}/> 
      <DeletePerson onClick={() => props.handleDelete(p)}/>
    </div>
  ))

const DeletePerson = (props) => {
  return <button onClick = {props.onClick}>delete</button>
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [nameFilter, setNewNameFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
    .then(people =>{
      setPersons(people)
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

    if (persons.some(p => (p.name === newName && newPhoneNumber !== p.number))){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const old = persons.find(p => p.name === newName)
        const newPerson = {...old, number:newPhoneNumber}
        personService.editPerson(newPerson).then(response => {
          setPersons(persons.map(p => p.id === old.id ? response.data : p))
          setErrorMessage(
            `${newName}'s number successfully changed to '${newPhoneNumber}'`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
        )
      }

    }
    else if (persons.some(p => p.name === newName)){
      alert(`${newName} is already added to phonebook`)
    }
    else{
      personService.create(nameObject)
                  .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                  })
      setErrorMessage(
          `Person '${newName}' with number '${newPhoneNumber}' successfully added`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
    setNewName('')
    setNewPhoneNumber('')
  }

  const peopleToShow = persons.filter(p => p.name.toLowerCase().includes(nameFilter.toLowerCase()))

  const handleDelete = person =>{
    if (window.confirm(`Delete ${person.name}?`)){
      personService.deletePerson(person.id).then(() =>{
        setPersons(persons.filter(p => p.id !== person.id))
      })
      .catch(response =>
        console.log(response)
      )
    }
    else{
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter value={nameFilter} onChange ={handleNameFilterChange}/>
      
      <h2>Add a New</h2>
      <Notification message={errorMessage} />
      <PersonForm 
        onSubmit={handleNameSubmit}
        newName={newName}
        nameOnChange={handleNameChange}
        newPhoneNumber={newPhoneNumber}
        numberOnChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>
      <PeopleDisplay people={peopleToShow} handleDelete = {handleDelete}/>
    </div>
  )
}

export default App