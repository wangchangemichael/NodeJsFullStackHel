import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setMessage(state, action) {
            return action.payload
        },
        clearMessage(state, action) {
            return ''
        }
    }
})



export const {setMessage, clearMessage} = notificationSlice.actions

export const setNotification = (message, seconds=5) => {
    return (dispatch) => {
        dispatch(setMessage(message))
        setTimeout(() => {
            dispatch(clearMessage())
        }, seconds * 1000)
    }
}
export default notificationSlice.reducer