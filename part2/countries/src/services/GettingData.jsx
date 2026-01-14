import axios from "axios";

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'
const all = 'api/all'
const getAll = () => {
    return (
        axios.get(baseUrl+all)
        .then(response => (response.data))
    );
}

const getByName = (name) => {
    return (
        axios.get(baseUrl + `api/name/${name}`)
        .then(response => (response.data))
    );
}



export {getAll, getByName}