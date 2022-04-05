import { generateClient } from "./libs/client"

export default async function handler(req, res) {
  const daysSinceEpoch = Math.floor((new Date()).getTime()/1000/86400)
  const { selected, question } = req.query
  
  const client = generateClient()

  await client.connect()

  try{
    if(selected === undefined || question === undefined)
      return

    const prompts = client.db("wordyourather").collection("prompts")
    const prompt: {date: string, answers: string[], options: number[]} = await prompts.findOne({}, {sort:{$natural:-1}}) as any

    let settings = {$inc:{}}
  
    settings.$inc[`options.${question}.${selected}`] = 1

    await prompts.updateOne({date: prompt.date} , settings)

    res.status(200).json({res:"Worked"})
  }
  catch(err) {
    console.log(err)
    res.status(404).json({res:"Unknown Error"})
  }

  await client.close()
}