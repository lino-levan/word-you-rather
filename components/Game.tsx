import moment from 'moment-timezone'
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url) => fetch(url).then((res) => res.json())

function Game({score, setScore, setWinScreen}) {
  const { data, error: eOptions } = useSWR('/api/getToday', fetcher)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [percentages, setPercentages] = useState<number[]>([])
  const [selected, setSelected] = useState(-1)

  const date = data?.date
  const answers = data?.answers?.[currentQuestion]
  const options = data?.options?.[currentQuestion]

  return (
    <>
      <h1 className="Merriweather text-5xl mb-10">Word You Rather?</h1>
      <div className="flex flex-col gap-2 max-w-md w-full">
        {
          answers?
          answers.map((answer, i)=>{
            let percentage = percentages.length > 0? percentages[i] : 0
            return (
              <div key={answer}>
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
                    ${percentage === 100? "border-radius: 1rem;":""}
                    transition: width 1s;
                  }
                `}</style>
                <div onClick={()=>{
                  if(selected === -1) {
                    setSelected(i)

                    fetcher(`/api/setAnswer?selected=${i}&question=${currentQuestion}`)

                    let calculatedPercentages = options.map((op, index)=>Math.round(((index===i?op+1:op)/(options.reduce((partialSum, a) => partialSum + a, 0) + 1))*100))

                    setPercentages(calculatedPercentages)
                    
                    if(calculatedPercentages[i] === calculatedPercentages.reduce((a, b) => Math.max(a, b), 0)) {
                      setScore(score+1)
                    }

                    if(currentQuestion === 4) {
                      localStorage.setItem("score", score.toString())
                      localStorage.setItem("date", moment().utc().tz('America/Los_Angeles').toISOString())
                      setWinScreen(true)
                    }
                  }
                }} className={`border rounded-2xl px-20 py-5 w-full relative z-10 percent-filled ${selected===i?"border-blue-400":""}`}>
                  <h2 className={`text-2xl text-center ${selected===i?"text-blue-400":""}`}>{answer}{percentages.length>0?` (${percentages[i]}%)`:''}</h2>
                </div>
              </div>
            )
          })
          :
          <h1 className="text-center">Loading...</h1>
        }
        {
          selected !== -1 && currentQuestion < 4?
          <div onClick={()=>{
            setSelected(-1)
            setCurrentQuestion(currentQuestion+1)
            setPercentages([])
          }} className="border rounded-2xl px-20 py-5 w-full relative z-10 percent-filled bg-blue-300 border-blue-400">
            <h2 className="text-2xl text-center">Next Question ({currentQuestion+1}/5)</h2>
          </div>
          :null
        }
        <h3 className="text-center">Score: {score}/5</h3>
      </div>
    </>
  )
}

export default Game