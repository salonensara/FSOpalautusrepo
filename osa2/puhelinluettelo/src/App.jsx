import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(
    {message: null,
      type: 'error'
    }
  )

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const updatePerson = (id, newNumber) => {
    const person = persons.find(p => p.id === id)
    if (!person) return

    const changedPerson = { ...person, number: newNumber }

    personService
      .update(changedPerson)
      .then(response => {
        setPersons(persons.map(p => p.id !== id ? p : response.data))
        setNotification({message:`Number updated for ${person.name}`, type:'success'})
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)
      })
      .catch(error => {
        setNotification({ message:`Information of ${person.name} has already been removed from server`, type:'error'})
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)
        console.error('Error updating person:', error)
        setPersons(persons.filter((p) => p.name !== person.name))

      })
  }

  const onRemove = (person) => {
    if (!window.confirm('Are you sure you want to delete this person?')) return

    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        setNotification( {message:'Person deleted successfully', type:'success'})
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)
      })
  }

  const onAddNew = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        updatePerson(person.id, newNumber)
      }
      return
    }

    personService
      .create({ name: newName, number: newNumber })
      .then(response => {
        setNotification({message:`Person added: ${response.data.name}`, type:'success'})
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)

        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber} addPerson={onAddNew} />
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={filter} deletePerson={onRemove} />
    </div>
  )

}

export default App