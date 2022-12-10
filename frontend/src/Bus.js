import { useEffect, useState } from "react";
import corsFetch from "./corsFetch";
import dayjs from "dayjs";
const actransitToken = 'AB9BD2A779420B5ECAF4172AFCAC6C58' //hmm does this change?

const stops = [
  {
    rt: '51A', stpid: '51526', // 51a 40th & broadway southbound
  },
  {
    rt: '12', stpid: '58997', // 12 Glen Ave & Panama Ct
  }
]

function BusPrediction(props) {
  const [predictions, setPredictions] = useState(null)
  useEffect(() => {
    corsFetch(`https://api.actransit.org/transit/actrealtime/prediction?token=${actransitToken}&stpid=${props.stpid}&rt=${props.rt}`)
      .then(res => res.json())
      .then(data => setPredictions(data))
  }, [])
  let formatted = null
  if (predictions) {
    const parseTime = (timeString) => {
      //format is 20221203 18:17
      const time = dayjs(timeString, 'YYYYMMDD HH:mm')
      const now = dayjs()
      const diff = time.diff(now, 'minutes')
    }
    formatted = <div className='flex flex-col text-lg'>
      <div className='text-lg'>
        {predictions['bustime-response'].prd[0].rt}
      </div>
      {/* <div className='text-sm'>
        {'to '}
        {predictions['bustime-response'].prd[0].des}
      </div>
      <div className='text-sm'>
        @ {predictions['bustime-response'].prd[0].stpnm}
      </div> */}
      <div className='text-lg font-bold'>
        in {(predictions['bustime-response'].prd[0].prdctdn)} mins
      </div>
      {
        predictions['bustime-response'].prd.length > 1 ?
        <div>
          also in {predictions['bustime-response'].prd.slice(1).map(prd => (prd.prdctdn)).join(', ')} mins
        </div>
        : null
      }
    </div>
  }
  return (
    <div className='flex justify-around'>
      {formatted}
    </div>
  )
}
export default function Bus(props) {


  return (
    <div>
      <h1>Bus</h1>
      <div className='grid grid-cols-2'>
        {stops.map(stop => <BusPrediction key={stop.stpid} stpid={stop.stpid} rt={stop.rt} />)}
      </div>
    </div>
  )
}
