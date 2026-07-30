import { useState } from 'react'

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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [nameFilter, setNewNameFilter] = useState('')

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

    let duplicate = false

    if (persons.some(p => p.name === newName)){
      alert(`${newName} is already added to phonebook`)
    }
    else{
      setPersons(persons.concat(nameObject))
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