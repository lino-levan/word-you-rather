// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const seededRandom = (s) => {
  var mask = 0xffffffff;
  var m_w  = (123456789 + s) & mask;
  var m_z  = (987654321 - s) & mask;

  return function() {
    m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
  }
}

export const max = 1000

export default function handler(req, res) {
  let postive: string[] = JSON.parse(process.env.POSITIVE)
  let negative: string[] = JSON.parse(process.env.NEGATIVE)

  let output: string[] = []

  const daysSinceEpoch = Math.floor(((new Date()).getTime()/1000 + 86400)/86400)

  const random = seededRandom(daysSinceEpoch)
  const numOptions = Math.ceil(random() * 3) + 1
  const postiveDay = random() < 0.5

  while(output.length < numOptions) {
    let pos = Math.floor(random() * max)
    if(postiveDay) {
      if(pos < postive.length) {
        output.push(postive[pos])
      }
    } else {
      if(pos < negative.length) {
        output.push(negative[pos])
      }
    }
  }

  res.status(200).json(output)
}
