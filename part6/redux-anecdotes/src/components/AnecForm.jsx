import { useDispatch } from "react-redux"
import { addAnecdotes } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecForm = () => {

    const dispatch = useDispatch()

    const handleSubmit = async (event) => {
        event.preventDefault()
        const content = event.target.Anec.value
        event.target.Anec.value = ''
        await dispatch(addAnecdotes(content))
        dispatch(setNotification(`You created '${content}'`,5))
        
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={handleSubmit}>
                <div>
                <input name='Anec'/>
                </div>
                <button type="submit">create</button>
            </form>
        
        </>

    )
    

}

export default AnecForm