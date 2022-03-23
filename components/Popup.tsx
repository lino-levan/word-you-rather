import Image from 'next/image'
import moment from "moment"
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

function Popup({score}) {
  const now = moment().utc().tz('America/Los_Angeles').subtract(1, 'day')

  return (
    <div className="shadow p-10 rounded-xl max-w-xl w-full flex flex-col items-center">
      <Image src='/logo.png' alt="wordyourather" width={200} height={200} className="mb-5"></Image>
      <h1 className="text-4xl text-center">You got a score of {score}/5!</h1>
      <h2 className="text-2xl text-center mb-4">{now.toISOString().split("T")[0]}</h2>
      <p>Make sure to come back tomorrow to try and get a better score!</p>
      <h2 className='text-2xl my-4'>Share your score!</h2>
      <div className='flex justify-center gap-5'>
        <EmailShareButton subject={`I got a score of ${score}/5!`} body={"I just won on https://wordyourather.com! You should try to beat my score!"} url={"https://wordyourather.com"}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <TwitterShareButton url={"https://wordyourather.com"} title={`I got a score of ${score}/5 on wordyourather! Can you beat it?`}>
            <TwitterIcon size={32} round />
        </TwitterShareButton>
        <FacebookShareButton url={"https://wordyourather.com"} quote={`I got a score of ${score}/5 on wordyourather! Can you beat it?`}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TelegramShareButton url={"https://wordyourather.com"} title={`I got a score of ${score}/5 on wordyourather! Can you beat it?`}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <FacebookMessengerShareButton url={"https://wordyourather.com"} appId="521270401588372">
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
      </div>
    </div>
  )
}

export default Popup