const Display = ({countries, state, setDisplayState, setCountries}) => {
    const handleShow = (country)=> {
        setCountries([country]);
        setDisplayState('matched');
    }
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

