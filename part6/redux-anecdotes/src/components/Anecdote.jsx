import { useDispatch, useSelector } from "react-redux"
import { voting } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"
const Anecdote = ({anecdote, handleVote}) => {
    return (
        <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={handleVote}>vote</button>
            </div>
        </div>
    )
}


const Anecdotes = () => {
    const dispatch = useDispatch()
    const anecs = useSelector(({anecdotes, filter}) => {
        if (filter === '') {
            return [...anecdotes].sort((a,b) => b.votes - a.votes)
        }else{
            return anecdotes.filter(anec => (anec.content.toLowerCase().includes(filter))).sort((a,b) => b.votes - a.votes)
        }
    })

    return (
        <>
            
            {
            anecs.map(anec => {
                return <Anecdote key={anec.id} anecdote={anec} handleVote={async ()=>{
                    await dispatch(voting(anec.id, anec.votes+1))
                    dispatch(setNotification(`You voted for '${anec.content}'`,5))
                }}/>
            })
        }
        </>
        
    )
}

export default Anecdotes





