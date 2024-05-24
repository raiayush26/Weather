import React, { useEffect, useState } from 'react'

import './Suggestion.css'

function Suggest() {
  const [city,setCity] = useState("");
  const [result,setResult] = useState([])
  const [weather,setWeather] = useState([]);
  const [airQuality,setAirQuality] = useState("");
  const [showLoading, setShowLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState([]);
  const GeoapifyKeys=import.meta.env.GeoapifyKeys;
  const weatherKey=import.meta.env.weatherKey;
  

  useEffect(()=>{
    if(city != ""){
      setShowLoading(false);
    }
    const timeID = setTimeout(()=>{
      if(city === ""){
        return;
      }
    
      fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${city}&format=json&apiKey=${GeoapifyKeys}&lang=en&limit=5`)
      .then(response => response.json())
      .then(data => {
        if(data.error){
          console.log("ess")
        }else{
          console.log(data);
          setResult(data.results);
        }        
      })
      .catch(err => console.log(err))
    },1000)
    return () => {
      clearTimeout(timeID)
    }


  },[city])
  const ExactLocation = () => {
    setShowLoading(false);
    navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition([position.coords.latitude, position.coords.longitude])
    })
}
useEffect(() => { 
  if(currentPosition.length === 0){
    return;
  }
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${currentPosition[0]}&lon=${currentPosition[1]}&appid=${weatherKey}&units=metric`;
  let url2 = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${currentPosition[0]}&lon=${currentPosition[1]}&appid=${weatherKey}`;


  fetch(url2).then(response => response.json()).then(data => {
    console.log(data.list[0].main.aqi);
    if(data.list[0].main.aqi === 1){
      setAirQuality("Good")
    }else if(data.list[0].main.aqi === 2){
      setAirQuality("Fair")
    }
    else if(data.list[0].main.aqi === 3){
      setAirQuality("Moderate")
    }
    else if(data.list[0].main.aqi === 4){
      setAirQuality("Poor")
    }
    else if(data.list[0].main.aqi === 5){
      setAirQuality("Very Poor")
    }
  
  })
  fetch(url)
  .then(response => response.json())
  .then(data => {
    setWeather(data);
  })
  .catch(err => console.log(err))
}, [currentPosition])

function undatedCity(e){
  setCity(e.target.value)
}
const handleChange = async(a,b,c) => {
  // console.log(e.target.innerText);
  
  console.log(a,b);
  console.log(c);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${a}&lon=${b}&appid=${weatherKey}&units=metric`;

  let url2 = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${a}&lon=${b}&appid=${weatherKey}`;


  fetch(url2).then(response => response.json()).then(data => {
    console.log(data.list[0].main.aqi);
    if(data.list[0].main.aqi === 1){
      setAirQuality("Good")
    }else if(data.list[0].main.aqi === 2){
      setAirQuality("Fair")
    }
    else if(data.list[0].main.aqi === 3){
      setAirQuality("Moderate")
    }
    else if(data.list[0].main.aqi === 4){
      setAirQuality("Poor")
    }
    else if(data.list[0].main.aqi === 5){
      setAirQuality("Very Poor")
    }
  
  })
  
  await fetch(url).then(response => response.json()).then(data => {
    
    setWeather(data);
   
  })
  .catch(err => console.log(err))

 
}
function getWeather(){
  if(weather === undefined){
    return <div>Not Found</div>
  }
  return <>
  <div 
   className='weather-report'>
    <h1>Weather Report </h1>
    <div className='weather-box'>
      <div className='weather-city'>City:-{weather.name}</div>
      <div className='weather-temp'>Temp {weather.main.temp || "0"}{"°C"} </div>
      <div className='weather-speed'>Speed:-{weather.wind.speed}{"km/h"}</div>
      <div className='weather-humidity'>Humidity:-{"677"}{"g/m3"}</div>
      <div className='weather-humidity'>Weather:- {weather.weather[0].description || "null"} </div>
      <div className='weather-humidity'>Air Quality:- { airQuality || "null"} </div>
    </div>
  </div>
  </>
}
useEffect(()=>{
  const timeID = setTimeout(()=>{
    getWeather();
    },10000)
    return () => {
      clearTimeout(timeID)
    }    
},[weather])


  return (
    <>
    <div className='input-suggestion'>
      <input type="text"  onChange={undatedCity} placeholder='city' />
      <br />
      <div>Your city is {city} </div>
      <div  className='country-name'>
        {result?.map((item,index) => (

            <div key={index}>
             <span onClick={(e)=>handleChange(item.lat,item.lon,item.city)}><l1>{item.city} - {item.state} - {item.county} </l1></span>
            </div>
          )
        )}
    </div>
    </div>
    <div className='temp-place'>
      <button  onClick={()=>ExactLocation()}> Temperature my Place </button>
    </div>
    <div hidden={showLoading}>
    {
      weather.length===0 ?  <div className='loading'>
      <span class="loader"></span>
      </div>: getWeather()
    }
    </div>       
       
    

    
    </>
  )
}

export default Suggest
