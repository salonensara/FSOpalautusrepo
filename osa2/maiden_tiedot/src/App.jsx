import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('promise fulfilled')
        setAllCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const filtered = newFilter === ''
      ? allCountries
      : allCountries.filter(country => 
          country.name.common.toLowerCase().includes(newFilter.toLowerCase())
        )
    setFilteredCountries(filtered)
  }, [allCountries, newFilter])

  useEffect(() => {
    const country = filteredCountries.length === 1
      ? filteredCountries[0]
      : null

    if (!country) {
      setWeather(null)
      return
    }

    const [lat, lng] = country.capitalInfo.latlng
    // Get weather data for the capital city using Open-Meteo API
    axios
      .get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
      .then(response => {
        setWeather(response.data.current_weather)
      })
  }, [filteredCountries])

  console.log('render', allCountries.length, 'countries')

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  if (filteredCountries.length > 10) {
    return (
      <div>
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
    return (
      <div>
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
        <ul>
          {filteredCountries.map(c => <li key={c.cca3}>{c.name.common} <button onClick={() => setFilteredCountries([c])}>Show</button></li>)}
        </ul>
      </div>
    )
  }

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    const [lat, lng] = country.capitalInfo.latlng
    return (
      <div>
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h3>Languages:</h3>
        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt="flag" width="150" />
        <Weather weather={weather} capital={country.capital} />
      </div>
    )
  }

  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <p>No matches found</p>
    </div>
  )
}

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <div>
      Filter countries <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
}

const Weather = ({ weather, capital }) => {
  if (!weather) return null

  const weatherIcons = {
  0: '☀️', // Clear sky
  1: '🌤️', // Mainly clear
  2: '⛅', // Partly cloudy
  3: '☁️', // Overcast
  45: '🌫️', // Fog
  51: '🌧️', // Drizzle: Light
  53: '🌧️', // Drizzle: Moderate
  55: '🌧️', // Drizzle: Dense
  61: '🌧️', // Rain: Light
  63: '🌧️', // Rain: Moderate
  65: '🌧️', // Rain: Heavy
  71: '🌨', // Snow fall: Light
  73: '🌨', // Snow fall: Moderate
  75: '🌨', // Snow fall: Heavy
  80: '🌦️', // Rain showers: Light
  81: '🌧️', // Rain showers: Moderate
  82: '⛈️', // Rain showers: Heavy
  95: '🌩️', // Thunderstorm
}

  const icon = weatherIcons[weather.weathercode] || ''
  console.log('weather code:', weather.weathercode, 'icon:', icon)

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather.temperature} Celsius</p>
      <p>Wind: {weather.windspeed} m/s</p>
      <div style={{ fontSize: '50px' }}>{icon}</div>
    </div>
  )
}

export default App