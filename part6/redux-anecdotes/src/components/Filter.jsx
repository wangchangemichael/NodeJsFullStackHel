import { useDispatch } from "react-redux"
import { setFilter } from "../reducers/filterReducer"

const Filter = () => {
const dispatch = useDispatch()
  const handleChange = (event) => {

    const theFilter = event.target.value.toLowerCase()
    dispatch(setFilter(theFilter))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter