import useSWR from 'swr'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const fetcher = (url) => fetch(url).then((res) => res.json())

const fetchAnswers = (callback: any, index?: number)=>{
  fetcher(`/api/getAnswers${index !== undefined?`?selected=${index}`:''}`)
    .then((answers: number[])=>{
      let total = answers.reduce((partialSum, a) => partialSum + a, 0)
      let temp = answers.map((answer)=>Math.round((answer/total*100)))

      callback(temp)
    })
}

const daysSinceEpoch = Math.floor((new Date()).getTime()/1000/86400)

export default function Home() {
  const { data: options, error: eOptions } = useSWR('/api/getToday', fetcher)

  const [streak, setStreak] = useState<number>(0)
  const [percentages, setPercentages] = useState<number[]>([])
  const [selected, setSelected] = useState<number>(-1)

  useEffect(()=>{
    if(parseInt(localStorage.getItem("lastPlayed")) === daysSinceEpoch) {
      if(localStorage.getItem("selected")) {
        setSelected(parseInt(localStorage.getItem("selected")))
        fetchAnswers(setPercentages)
      }
    }

    localStorage.setItem("streak", localStorage.getItem("streak") || "0")

    setStreak(parseInt(localStorage.getItem("streak")))
  }, [])

  return (
    <div>
      <Head>
        <title>Word You Rather</title>
        <meta name="description" content="The ultimate daily game of word you rather." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center h-screen">
        <h1 className="Merriweather text-5xl mb-10">Word You Rather?</h1>
        <div className="flex flex-col gap-2 max-w-md w-full">
          {
            options?
            options.map((option, i)=>{
              let percentage = percentages.length > 0? percentages[i] : 0
              return (
                <div key={option}>
                  <style jsx>{`
                    .percent-filled:before{
                      position:absolute;
                      z-index:-1;
                      top:0;
                      left:0;
                      width:${percentage}%;
                      height:100%;
                      content:"";
                      background-color:rgb(241, 245, 249);
                      border-top-left-radius: 1rem;
                      border-bottom-left-radius: 1rem;
                      transition: width 1s;
                    }
                  `}</style>
                  <div onClick={()=>{
                    if(selected === -1) {
                      setSelected(i)

                      fetchAnswers(setPercentages, i)

                      localStorage.setItem("lastPlayed", daysSinceEpoch.toString())
                      localStorage.setItem("selected", i)

                      localStorage.setItem("streak", (parseInt(localStorage.getItem("streak"))+1).toString())
                      setStreak(parseInt(localStorage.getItem("streak")))
                    }
                  }} className={`border rounded-2xl px-20 py-5 w-full relative z-10 percent-filled ${selected===i?"border-blue-400":""}`}>
                    <h2 className={`text-2xl text-center ${selected===i?"text-blue-400":""}`}>{option}{percentages.length>0?` (${percentages[i]}%)`:''}</h2>
                  </div>
                </div>
              )
            })
            :
            <h1 className="text-center">Loading...</h1>
          }
        </div>
      </main>
    </div>
  )
}
