const CountryFinder = ({allCountries,setCountries, setDisplayState}) => {

    const inputHandler = (event) => {
        const tar = event.target.value.toLowerCase();
        if (tar){
            const res = allCountries.filter(country => country.name.common.toLowerCase().includes(tar));
    
            if (res.length >=10) {
                setDisplayState("too_many");
            }else if(res.length >1) {
                setDisplayState("multi");
                setCountries(res);
            }else if (res.length === 1) {
                setDisplayState('matched');
                setCountries(res);
            }else{
                setDisplayState('nothing');
            }
            
        }else {
                    setDisplayState('nothing');
            }
    



    }

    return (
        <div>
        find countries <input onChange={inputHandler}/>
        </div>
    )
}

export default CountryFinder