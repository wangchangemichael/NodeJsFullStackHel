import { createSlice } from '@reduxjs/toolkit'
import anecService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createNewAnec(state, action) {
      state.push(action.payload)
    },
    voteTheIDOf(state, action) {
      const id = action.payload
      const theOne = state.find(anec => anec.id === id)
      const changedAnec = {
        ...theOne,
        votes: theOne.votes +1
      }
      return state.map(anec => anec.id === id ? changedAnec : anec)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const {setAnecdotes,createNewAnec,voteTheIDOf} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecs = await anecService.getAll()
    dispatch(setAnecdotes(anecs))
  }
}

export const addAnecdotes = (content) => {
  return async (dispatch) => {
    const theOne = await anecService.createNew(content)
    dispatch(createNewAnec(theOne))
  }
}

export const voting = (id,vote) => {
  return async (dispatch) => {
    await anecService.updateVote(id, vote)
    dispatch(voteTheIDOf(id))
  }
}


export default anecdoteSlice.reducer
