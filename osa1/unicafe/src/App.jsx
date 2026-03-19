import { useState } from 'react'

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  
  const statisticsData = [
    { text: "good", value: good },
    { text: "neutral", value: neutral },
    { text: "bad", value: bad },
    { text: "all", value: all },
    { text: "average", value: average },
    { text: "positive", value: positive }
  ]

  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          {statisticsData.map((stat) => (
            <tr key={stat.text}>
              <td>{stat.text}</td>
              <td>
                <StatisticsLine text={stat.text} value={stat.value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const StatisticsLine = ({ text, value }) => {
  if (text === "positive") {
    return (
      <p>
        {text}: {value} %
      </p>
    )
  }
  return (
    <p>
      {text}: {value}
    </p>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
    setAll(all + 1)
    setAverage((good + 1 - bad) / (all + 1))
    setPositive(((good + 1) / (all + 1)) * 100)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
    setAverage((good - bad) / (all + 1))
    setPositive((good / (all + 1)) * 100)
  }

  const handleBad = () => {
    setBad(bad + 1)
    setAll(all + 1)
    setAverage((good - (bad + 1)) / (all + 1))
    setPositive((good / (all + 1)) * 100)
  }

  const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>
      {text}
    </button>
  )

  return (
    <div>

      <h1>Give feedback</h1>
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad} text="bad" />

      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App