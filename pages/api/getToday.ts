import moment from 'moment-timezone'
import { generateClient } from './libs/client'

const cleanData = (data: {answers: string[][], options: number[][], date: string}) => {
  return {
    date: data.date,
    answers: data.answers,
    options: data.options
  }
}

export default async function handler(req, res) {
  let postive: string[] = JSON.parse(process.env.POSITIVE)
  let negative: string[] = JSON.parse(process.env.NEGATIVE)

  let answers: string[][] = []

  const client = generateClient()

  const now = moment().utc().tz('America/Los_Angeles')

  for(let numQuestions = 0; numQuestions < 5; numQuestions++) {
    const numOptions = Math.ceil(Math.random() * 3) + 1
    const postiveDay = Math.random() < 0.5
    
    answers.push([])
    while(answers[numQuestions].length < numOptions) {
      if(postiveDay) {
        let pos = Math.floor(Math.random() * postive.length)
        if(pos < postive.length && !answers[numQuestions].includes(postive[pos])) {
          answers[numQuestions].push(postive[pos])
        }
      } else {
        let pos = Math.floor(Math.random() * negative.length)
        if(pos < negative.length && !answers[numQuestions].includes(negative[pos])) {
          answers[numQuestions].push(negative[pos])
        }
      }
    }
  }

  await client.connect()

  try {

    const prompts = client.db("wordyourather").collection("prompts")
    const prompt: {date: string, answers: string[][], options: number[][]} = await prompts.findOne({}, {sort:{$natural:-1}}) as any

    if(prompt === null || !now.isSame(moment(prompt.date), 'date')) {
      const generated = {
        date: now.toISOString(),
        answers: answers,
        options: answers.map((answer)=>answer.map(()=>0))
      }

      console.log(generated)

      res.status(200).json(cleanData(generated))

      await prompts.insertOne(generated)
    } else {
      console.log(prompt)

      res.status(200).json(cleanData(prompt))
    }
  }
  catch(err) {}

  await client.close()
}
