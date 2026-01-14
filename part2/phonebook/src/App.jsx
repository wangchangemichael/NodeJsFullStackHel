import { useEffect, useState } from 'react'
import personServices from './services/persons'
import Notification from './components/Notification';


const Add = ({newName, newNumber,  persons, setter}) => {
  const [setNewName, setNewNumber, setPersons, setFiltered, setMessage, setMessageType] = setter;
  const handleInput = (event) => {
    // event.preventDefault();
    setNewName(event.target.value);
  }

  const handleAdd = (event) => {
    event.preventDefault();
    if(!(newName && newNumber)){
      alert('you have to enter both name and phonenumber')
      return;
    }
    const resetInputs = () => {
      setNewName('');
      setNewNumber('');
    }

    const updateState = (newPersons) => {
      setPersons(newPersons);
      setFiltered(newPersons);
      resetInputs();
    }

    const showMessage = (message, type='success') => {
      setMessage(message);
      setMessageType(type);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }

    if (persons.some((ele) => (ele["name"] === newName))) {
      const existingPerson = persons.find(p=>p.name === newName);
      const updatedPerson = {...existingPerson, number: newNumber}
      if (window.confirm(`${newName} is already in the phonebook. Replace the old number with the new one?`)) {
        personServices.update(existingPerson.id, updatedPerson)
        .then(returnedP => {
          const newPersons = persons.map(p => p.id=== existingPerson.id? returnedP : p);
        updateState(newPersons);
        })
        .then(()=> showMessage(`Updated number for ${updatedPerson.name}`))
        .catch(erro => {
          showMessage(
            `Information of ${existingPerson.name} has already been removed from server`,
            'error'
          );
          const newPersons = persons.filter(p => p.id !== existingPerson.id);
          setPersons(newPersons);
          setFiltered(newPersons);
        })
      }else{
        resetInputs();
      }
    }else {
      const thePerson = {name: newName, number: newNumber};
      personServices.create(thePerson)
      .then(returnedP => {
        updateState(persons.concat(returnedP));
      })
      .then(
        ()=> showMessage(`Added ${thePerson.name}`)
      );
    }
  }

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value);
  }

  return (
    <form>
        <div>
          name: <input value={newName} onChange={handleInput}/>
        </div>
        <div>number: <input value={newNumber} onChange={handleNumberInput} /></div>
        <div>
          <button type="submit" onClick={handleAdd}>add</button>
        </div>
    </form>
  )
}

const InfoDisplay = ({persons, filtered, setPersons, setFiltered, setMessage, setMessageType}) => {
  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm("Sure you want to delete?")) {
      personServices.remove(id)
    .then(()=>{
      const newPersons = persons.filter(p=> p.id !== id);
      const newFiltered = filtered.filter(p=> p.id !== id);
      setPersons(newPersons);
      setFiltered(newFiltered);
    })
    .catch(erorr => {
      setMessage(`${person.name} was already deleted from server`);
      setMessageType('error');  
      setTimeout(() => setMessage(null), 5000);
      setPersons(persons.filter(p => p.id !== id));
      setFiltered(filtered.filter(p => p.id !== id));
    })
    }
    
  }
  return (
    filtered.map((person) => {
      return (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={()=>handleDelete(person.id)}>delete</button>
          <br></br> 
        </p>
      )
    })

  )
}


const Filtering = ({persons, newFilter, setNewFilter,setFiltered}) => {

  const handleFilterInput = (event) => {
    setNewFilter(event.target.value);
    const results = persons.filter((person) => (person.name.toLowerCase().includes(event.target.value.toLowerCase())));
    setFiltered(results);
  }

  
  return (
    <>
      filter shown with <input value={newFilter} onChange={handleFilterInput} />
    </>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filtered, setFiltered] = useState(persons);
  const [newFilter, setNewFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    personServices.getAll()
    .then(data=> {
      setPersons(data);
      setFiltered(data);
    })
  }, [])

  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filtering persons={persons} newFilter={newFilter} setNewFilter={setNewFilter} setFiltered={setFiltered} />
      <h2>add a new</h2>
      <Add newName={newName}  newNumber={newNumber} persons={persons} setter={[setNewName, setNewNumber, setPersons, setFiltered, setMessage, setMessageType]}/>
      <div>debug: {newName}</div>
      <h2>Numbers</h2>
      <InfoDisplay persons={persons} filtered={filtered} setPersons={setPersons} setFiltered={setFiltered} setMessage={setMessage} setMessageType={setMessageType} />
      
    </div>
    
  )
}

export default App