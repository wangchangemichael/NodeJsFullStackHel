import { useState, useEffect } from 'react';
import { getWeather } from '../services/GettingData';
const Display = ({countries, state, setDisplayState, setCountries}) => {
    const handleShow = (country)=> {
        setCountries([country]);
        setDisplayState('matched');
    }

    const [weather, setWeather] = useState(null);
    useEffect(() => {
          if (state === 'matched' && countries.length === 1) {
              const capital = countries[0].capital[0]; 
              getWeather(capital)
                  .then(data => setWeather(data))
                  .catch(error => console.log('Weather fetch failed:', error));
          }
      }, [state, countries]);

    if (state === 'nothing') {
        return <></>
    }
    else if ( state === 'too_many') {
        return (
        <div>
            There are too many matches, enter more words.
        </div>)
    }else if (state === 'matched') {
        const country = countries[0];
        return (
            <div>
                <div>
                    <h1>{country.name.common}</h1>
                    <p>Capital {country.capital}</p>
                    <p>Area {country.area}</p>
                </div>
                <div>
                    <h1>Languages</h1>
                    <ul>
                            {Object.entries(country.languages).map(
                                ([key,value]) => {
                                    return (
                                        <li key={key}>
                                            {value}
                                        </li>
                                    )    
                                }
                            )}
                    </ul>
                </div>
                <img src={country.flags.png} alt={country.flags.alt}></img>
                
                {weather && (
                      <div>
                          <h2>Weather in {country.capital}</h2>
                          <p>Temperature: {weather.main.temp} °C</p>
                          <img 
                              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                              alt={weather.weather[0].description}
                          />
                          <p>Wind: {weather.wind.speed} m/s</p>
                      </div>
                  )}


            </div>
        )


    } else if (state === 'multi') {
        return (
            <div>
                {

                    countries.map(country => {
                        return (
                            <p key={country.cca3}>
                                {country.name.common} <button onClick={()=>handleShow(country)}>Show</button>
                            </p>
                    
                        )
                    })

                }

            </div>
            
        )
    }
}

export default Display

