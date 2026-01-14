import { useEffect, useState } from 'react';
import CountryFinder from './components/CountryFinder';
import Display from './components/Display';
import {getAll} from './services/GettingData';



function App() {
  const [countries, setCountries] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [displayState, setDisplayState] = useState("nothing")

  useEffect(()=> {
    getAll().then(data=> setAllCountries(data));
  },[]);


  return (
    <div>
      <CountryFinder allCountries={allCountries} setCountries={setCountries} setDisplayState={setDisplayState}/>
      <Display countries={countries} state={displayState} setDisplayState={setDisplayState} setCountries={setCountries} />
    </div>
  )
}

export default App
