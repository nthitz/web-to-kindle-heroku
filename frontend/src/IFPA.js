import { useEffect, useState } from "react";
import corsFetch from "./corsFetch";
import cheerio from 'cheerio'
export default function IFPA(props) {

  const [ranking, setRanking] = useState(null)

  useEffect(() => {
    corsFetch('https://www.ifpapinball.com/player.php?p=44733')
      .then(res => res.text())
      .then(html => {
        const $ = cheerio.load(html)
        const ranking = $('h2').text()
        const rankingNumber = ranking.split(':')[1].trim()
        setRanking(rankingNumber)

      })

  }, [])

  return (
    <div className='flex justify-around my-4'>
      {ranking ? <div className='text-xl font-bold'>Current IFPA Ranking {ranking}</div>
      : null}
    </div>
  )
}
