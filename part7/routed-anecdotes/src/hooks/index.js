import { useState } from "react"

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (e) => {
        const newVal = e.target.value
        setValue(newVal)
    }

    const clearing = () => {
        setValue('')
    }

    return {
        inputProps: {type, value, onChange},
        reset: clearing
    }
}