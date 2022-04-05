import { Handler } from "@netlify/functions"
import { generateClient } from "./libs/client"

export const handler: Handler = async (event, context) => {
  const { selected, question } = event.queryStringParameters
  
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

    await client.close()
    return {
      statusCode: 200,
      body: JSON.stringify({res:"Worked"}),
    }
  }
  catch(err) {
    console.log(err)

    await client.close()
    return {
      statusCode: 404,
      body: JSON.stringify({res:"Unknown Error"}),
    }
  }
}