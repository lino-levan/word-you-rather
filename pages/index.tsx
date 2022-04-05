import Head from 'next/head'
import { useState } from 'react'
import useSWR from 'swr'
import Game from '../components/Game'
import Popup from '../components/Popup'

export const functionsDir = '/.netlify/functions'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Home() {
  const { data, error: eOptions } = useSWR(`${functionsDir}/getToday`, fetcher)

  const [score, setScore] = useState(0)
  const [winScreen, setWinScreen] = useState(false)

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
          <Game score={score} setScore={setScore} setWinScreen={setWinScreen} data={data}/>
        }
      </main>
    </div>
  )
}
