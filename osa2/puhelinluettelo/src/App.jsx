import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(
    {message: null,
      type: 'error'
    }
  )

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'notes')

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const replaceNumber = (id, newNumber) => {
    const person = persons.find(p => p.id === id)
    if (!person) return

    const changedPerson = { ...person, number: newNumber }
    const url = `http://localhost:3001/persons/${id}`

    axios.put(url, changedPerson)
      .then(response => {
        setPersons(persons.map(p => p.id !== id ? p : response.data))
        setNotification({message:`Number updated for ${person.name}`, type:'success'})
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)
      })
      .catch(error => {
        setNotification({ message:`Failed to update number for ${person.name}`, type:'error'})
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)
        console.error('Error updating person:', error)
      })
  }

  const deletePerson = (id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) return

    axios.delete(`http://localhost:3001/persons/${id}`)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setNotification( {message:'Person deleted successfully', type:'success'})
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)
      })
      .catch(error => {
        setNotification('Failed to delete person')
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)
        console.error({message:'Error deleting person:', type:'error'}) 
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        replaceNumber(person.id, newNumber)
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    axios
      .post('http://localhost:3001/persons', personObject)
      .then(response => {
        setNotification({message:`Person added: ${response.data.name}`, type:'success'})
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)

        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setNotification({message:'Failed to add person', type:'error'})
        setTimeout(() => {
          setNotification({ ...notification, message: null})
        }, 5000)
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber} addPerson={addPerson} />
      <h2>Numbers</h2>
      <ShowPersons persons={persons} newFilter={newFilter} deletePerson={deletePerson} />
    </div>
  )

}


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

const ShowPersons = ({ persons, newFilter, deletePerson }) => {
  const personsToShow = newFilter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <ul>
      {personsToShow.map(person => (
        <li key={person.name}>{person.name} {person.number} <button type="button" onClick={() => deletePerson(person.id)}>delete</button></li>
      ))}
    </ul>
  )
}

const deletePerson = (id) => {

  confirm('Are you sure you want to delete this person?')
  axios.delete(`http://localhost:3001/persons/${id}`)
    .then(response => {
      setNotification({message:`Person deleted: ${response.data.name}`, type:'success'})
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    })
    .catch(error => {
      setNotification({message: `Error deleting ${response.data.name}`, type:'error'})
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    })
}

const replaceNumber = (id, newNumber) => {
  const person = persons.find(p => p.id === id)
  const changedPerson = { ...person, number: newNumber }
  url = `http://localhost:3001/persons/${id}`
  axios.put(url, changedPerson)
    .then(response => {
      setPersons(persons.map(p => p.id !== id ? p : response.data))
    })
    .catch(error => {
      setNotification({message: `Information of ${response.data.name} has already been removed from server`, type:'error'})
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    })
}

export default App