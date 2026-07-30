const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => (
  <div>
    {props.parts.map(part => 
      <Part key={part.id} part={part}/>
    )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Course = (props) => {
  let total = props.course.parts.reduce((sum, currentValue) => 
    sum + currentValue.exercises
  , 0 )

  return (
  <div>
    <Header course = {props.course.name}/>
    <Content parts = {props.course.parts}/>
    <Total total = {total}/>

  </div>
)}

const Total = (props) => <p><b>total of {props.total} exercises</b></p>

export default Course