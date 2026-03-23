import { useState } from 'react'

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ newName, newNumber, setNewName, setNewNumber, addPerson }) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <form onSubmit={addPerson}>
        <div> name: <input value={newName} onChange={handleNameChange} /> </div>
        <div> number: <input value={newNumber} onChange={handleNumberChange} /> </div>
        <div> <button type="submit">add</button></div>
      </form>
    </div>
  )
}

const ShowPersons = ({ persons, newFilter }) => {
  const personsToShow = newFilter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <ul>
      {personsToShow.map(person => (
        <li key={person.name}>{person.name} {person.number}</li>
      ))}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber} addPerson={addPerson} />
      <h2>Numbers</h2>
      <ShowPersons persons={persons} newFilter={newFilter} />
    </div>
  )

}

export default App