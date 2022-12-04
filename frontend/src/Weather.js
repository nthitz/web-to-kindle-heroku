import dayjs from "dayjs";
import { useEffect, useState } from "react";
const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const lat = 37.825132839390506
const lon = -122.25332283032986
// const lat = 37.80431192515931
// const lon = -122.27153802959046
//
const url = () => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

export default function Weather(props) {

  const [weather, setWeather] = useState(null)
  useEffect(() => {
    fetch(url())
      .then(res => res.json())
      .then(data => setWeather(data))
  }, [])

  console.log(weather)
  let formatted = null
  if (weather) {
    const days = weather.daily.slice(0, 5)
    const hours = weather.hourly.slice(0, 12)
    formatted = <div>
      <div className='flex justify-around items-stretch'>
          {days.map(day => {
            const date = dayjs(day.dt * 1000)
            return <div key={day.dt} className='flex items-center flex-col'>
              <div>{date.format('MMM D')}</div>
              <div><img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} /></div>
              <div>{day.weather[0].description}</div>
              <div>{Math.round(day.temp.min)}° / {Math.round(day.temp.max)}°</div>
            </div>

          })}
      </div>
      <br />
      <div className='grid grid-cols-6 items-stretch text-sm'>
        {hours.map(hour => {
          const date = dayjs(hour.dt * 1000)
          return <div key={hour.dt} className='flex items-center flex-col '>
            <div>{date.format('hA')}</div>
            <div><img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} /></div>
            <div >{hour.weather[0].description}</div>
            <div>{Math.round(hour.temp)}°</div>
          </div>
        })}
      </div>
    </div>
  }
  return (
    <div>
      {formatted}
    </div>
  )

}
