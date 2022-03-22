import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const daysSinceEpoch = Math.floor(((new Date()).getTime()/1000 + 25200)/86400)
  const { selected } = req.query

  const uri = process.env.MONGO_URI

  try{
    const client = new MongoClient(uri)

    await client.connect()

    const answers = client.db("wordyourather").collection("answers")

    const raw = await answers.findOne({date: daysSinceEpoch})
    let answer = {
      date: daysSinceEpoch,
      options: []
    }

    console.log(req.query)

    if(selected !== undefined) {
      console.log(selected)
      if(raw) {
        answer.options = raw.options
  
        answer.options[selected]++
  
        await answers.updateOne(
          { date: daysSinceEpoch },
          {
            $set: {
              options: answer.options
            },
          },
          { upsert: true }
        );
      } else {
        let options = (new Array(4)).fill(0).map(()=>0)
  
        options[selected]++
  
        answer = {
          date: daysSinceEpoch,
          options: options
        }
  
        await answers.insertOne(answer)
      }
    } else {
      answer.options = raw.options
    }
    

    await client.close()

    res.status(200).json(answer.options)
  }
  catch(err) {
    console.log(err)
    res.status(404).json({error: "Unknown Error"})
  }
}
