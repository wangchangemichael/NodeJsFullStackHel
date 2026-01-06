import { useState } from 'react'


const Header = ({text}) => {
  return (
    <h1>
      {text}
    </h1>
  )
}

const Button = ({handler, text}) => {
  return (
    <button onClick={handler}>{text}</button> 
  )
}

const StatisticLine = ({val, text}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{val}</td>
    </tr>
  )
}

const Statistics = ({stats}) => {
  const [good, neutral, bad, total, avg, pos] = stats;
  if (total === 0) {
    return (
      <>
      <Header text="statistics" />
      <p>No feedback given</p>
      </>
    )
  }else {
    return (
    <table>
    <thead>
      <tr>
        <th>
          <Header text="statistics" />
        </th>
      </tr>
    </thead>
    <tbody> 
      <StatisticLine val={good} text="good" />
      <StatisticLine val={neutral} text="neutral" />
      <StatisticLine val={bad} text="bad" />
      <StatisticLine val={total} text="all" />
      <StatisticLine val={avg} text="avg" />
      <StatisticLine val={pos} text="pos" />
    </tbody>
    </table>    
  )
  }  
}



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleRate = (type) => () => {
    if (type === "good"){
      setGood(good+1);
    }else if (type === "neutral"){
      setNeutral(neutral+1);
    }else{
      setBad(bad+1);
    }
  }

  const getStats = () => {
    
    const total = good + neutral + bad;
    const average = (good*1 + bad * (-1)) / total;
    const positive = ((good / total) * 100 ).toString() + "%";
    
    return [good, neutral, bad, total, average, positive];
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button handler={handleRate("good")} text="good" />
      <Button handler={handleRate("neutral")} text="neutral" />
      <Button handler={handleRate("bad")} text="bad" />
      <Statistics stats={getStats()} />
    </div>
  )
}

export default App