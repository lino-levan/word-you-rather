import moment from 'moment'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Game from '../components/Game'
import Popup from '../components/Popup'

export default function Home() {
  const [score, setScore] = useState(0)
  const [winScreen, setWinScreen] = useState(false)

  useEffect(()=>{
    const now = moment().utc().tz('America/Los_Angeles')

    if(localStorage.getItem("date") && now.isSame(moment(localStorage.getItem("date")))) {
      localStorage.removeItem("score")
    }

    if(localStorage.getItem("score") !== null) {
      setScore(parseInt(localStorage.getItem("score")))
      setWinScreen(true)
    }
  }, [])

  return (
    <div>
      <Head>
        <title>Word You Rather</title>
        <meta name="description" content="The ultimate daily game of word you rather." />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main className="flex flex-col justify-center items-center h-screen p-4">
        {
          winScreen?
          <Popup score={score}/>
          :
          <Game score={score} setScore={setScore} setWinScreen={setWinScreen}/>
        }
      </main>
    </div>
  )
}
