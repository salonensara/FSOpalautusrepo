  const Course = ({ course }) => {

    const Header = (props) => {
      return (
        <div>
          <h1>{props.title}</h1>
        </div>
      )
    }

    const Content = ({ parts }) => {
      return (
        <div>
          <ul>
            {parts.map((part) =>
              <li key={part.id}>
                {part.name} {part.exercises}
              </li>
            )}
          </ul>
        </div>
      )
    }

    const Total = ({ parts }) => {
      const total = parts.reduce((sum, part) => sum + part.exercises, 0)

      return (
        <div>
          <p>Total of exercises {total}</p>
        </div>
      )
    }

    return (
      <div>
        <Header title={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )

  }

export default Course