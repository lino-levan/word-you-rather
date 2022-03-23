import { MongoClient } from "mongodb";

export const generateClient = ()=> {
  const uri = process.env.MONGO_URI

  return new MongoClient(uri)
}