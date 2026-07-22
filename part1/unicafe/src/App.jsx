import { useState } from 'react'
const Button = (props) => (
  <button onClick = {props.onClick}>{props.text}</button>
)

const Header = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

const Statistics = ({good,bad,neutral})=> {
  let total = good + bad + neutral
  if (total > 0){
    return(
      <>
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>
        <p>all {total}</p>
        <p>average {(good - bad) / (total)}</p>
        <p>positive {(good)/(total)}%</p>
      </>
    )
  }
  else{
    return "No feedback given"
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increment = (props) =>{
    props.setState(props.value)
  }

  return (
    <div>
      <Header text = "give feedback"/>
      <Button 
      onClick = {() => increment({
        setState: setGood, 
        value: good + 1})} 
      text = "good"/>
      <Button 
      onClick = {() => increment({
        setState: setNeutral, 
        value:neutral + 1})} 
      text = "neutral"/>
      <Button 
      onClick = {() => increment({
        setState: setBad, 
        value: bad + 1})} 
      text = "bad"/>

      <Header text = "statistics"/>
      <Statistics good = {good} bad = {bad} neutral = {neutral}/>
    </div>
  )
}

export default App