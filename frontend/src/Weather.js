import dayjs from "dayjs";
import { extent } from "d3-array";
import { useEffect, useState } from "react";
import { scaleLinear, scaleTime } from "d3-scale";
import { area  } from "d3-shape";
const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const lat = 37.8263268128464
const lon =  -122.25416105401307
// const lat = 37.80431192515931
// const lon = -122.27153802959046
//
const url = () => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

function WeatherHourlyGraph(props) {
  const { hours } = props
  /*         {hours.map(hour => {
          const date = dayjs(hour.dt * 1000)
          return <div key={hour.dt} className='flex items-center flex-col '>
            <div>{date.format('hA')}</div>
              <div
                style={{
                  backgroundImage: `url(https://openweathermap.org/img/wn/${hour.weather[0].icon}.png)`,
                  backgroundSize: '130%'
                }}
                className='w-6 h-6 bg-no-repeat bg-center'

              />
            <div >{hour.weather[0].description}</div>
            <div>{Math.round(hour.temp)}°</div>
          </div>
        })} */
  const tempExtent = extent(hours, d => d.temp)
  const timeExtent = extent(hours, d => d.dt * 1000)
  let width = 600
  let height = 100
  const margins = {
    top: 20, right: 20, bottom: 0, left: 20
  }
  const svgWidth = width
  const svgHeight = height
  width = width - margins.left - margins.right
  height = height - margins.top - margins.bottom

  const tempScale = scaleLinear()
    .domain(tempExtent)
    .range([height, 0])
  const timeScale = scaleTime()
    .domain(timeExtent)
    .range([0, width])

  const areaGenerator = area()
    .x(d => timeScale(d.dt * 1000))
    .y0(height)
    .y1(d => tempScale(d.temp))

  const pathData = areaGenerator(hours)


  return (
    <div>
      <svg width={svgWidth} height={svgHeight} className='overflow-visible'>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <path d={pathData} fill='black'  opacity='0.3' stroke='black'/>
          {hours.map(hour => {
            const date = dayjs(hour.dt * 1000)
            return <g
              key={hour.dt}
              transform={`translate(${timeScale(hour.dt * 1000)}, ${tempScale(hour.temp)})`}
              textAnchor='middle'
              fontSize='18'
            >
              <text y={-5}>{Math.round(hour.temp)}°</text>
              <text y='-5' dy='-1.2em'>{date.format('hA')}</text>

            </g>
          })}
        </g>
      </svg>
    </div>
  )
}

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
            const isDateToday = date.isSame(dayjs(), 'day')
            const isDateTomorrow = date.isSame(dayjs().add(1, 'day'), 'day')
            const dayName = isDateToday ? 'Today' : isDateTomorrow ? 'Tomorrow' : date.format('ddd')
            return <div key={day.dt} className='flex items-center flex-col'>
              <div>{dayName}</div>
              <div><img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} /></div>
              <div className='text-xl'>{day.weather[0].description}</div>
              <div className='text-xl whitespace-nowrap'>{Math.round(day.temp.min)}° / {Math.round(day.temp.max)}°</div>
            </div>

          })}
      </div>
      <br />
      <div className='grid grid-cols-6 items-stretch text-sm'>
        <WeatherHourlyGraph hours={hours} />

      </div>
    </div>
  }
  return (
    <div>
      {formatted}
    </div>
  )

}
