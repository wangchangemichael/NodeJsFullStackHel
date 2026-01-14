const Header = (props) => <h1>{props.name}</h1>

const Content = (props) => {
    const {parts} = props;
    return (
        <div>
            {parts.map((part) => {
                return <Part key={part.id} part={part} />
            } )}
        </div>

    )
    

}

const Part = (props) => (
    <p>
        {props.part.name} {props.part.exercises}
    </p>
)

const Course = ({course}) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts}/>
      <Total parts ={course.parts} />
    </>
    
  )
}


const Total = (props) => {
  const {parts} = props;
  const total = parts.reduce((sum, part)=> {
    return sum+= part.exercises;
  },0);
  return (
    <>
      <b>total of {total} exercises</b>
    </>
  )
}

export default Course;