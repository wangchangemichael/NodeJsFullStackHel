import { useEffect } from 'react'
import Anecdotes from './components/Anecdote'
import AnecForm from './components/AnecForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
const App = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(initializeAnecdotes())
  },[dispatch])
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <Anecdotes />
      <AnecForm />
    </div>
  )
}

export default App
