import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import dataImage from '../public/images/data.jpg'
import codeImage from '../public/images/code.jpg'
import lockImage from '../public/images/lock.jpg'
import Hero from '../components/hero'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-24">
      <Hero />
      <div className="flex flex-row items-center justify-evenly h-[800px] w-[100vw] bg-gray-950 px-25">

        <div className="max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <Image className="rounded-t-lg" src={dataImage} height={850} width={850} alt="Image of data" />
          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Real-Time Insights</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Instantly access live data on the number of individuals entering and exiting your building, empowering you to make informed decisions on the fly.</p>
          </div>
        </div>

        <div className="max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <Image className="rounded-t-lg" src={lockImage} height={850} width={850} alt="Image of code" />
          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Security at its Core</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Prioritize safety with our state-of-the-art security features, providing you with the tools to ensure the well-being of everyone within your premises.</p>
          </div>
        </div>

        <div className="max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <Image className="rounded-t-lg" src={codeImage} height={850} width={850} alt="Image of code" />
          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Seamless Integration</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Our platform seamlessly integrates with your existing systems, making implementation a breeze. Maximize the value of your current infrastructure with minimal disruption.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
