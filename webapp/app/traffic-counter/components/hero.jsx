import Image from "next/image";
import heroImage from "../public/images/hero.jpg";
import Link from "next/link";


const Hero = () => {
    return (
        <div className="flex items-center justify-center w-screen h-[80vh] mx-auto">
            <Image className="object-cover object-center w-full saturate-200 hue-rotate-15"
                priority={true}
                src={heroImage}
                alt="hero image"
                style={{ position: "fixed", top: 75, left: 0, zIndex: -1, height: "80%" }}
            />
            <div className="max-w-[80vw] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Unlock Intelligent Control</h5>
                <ul className="mb-3 text-xl font-normal text-gray-700 dark:text-gray-400 ml-5">
                    <li className="list-['🚀'] py-1">&nbsp; Real-Time Insights: Instantly gauge foot traffic with live data updates.</li>
                    <li className="list-['🌐'] py-1">&nbsp; Remote Monitoring: Keep watch from anywhere, anytime.</li>
                    <li className="list-['📈'] py-1">&nbsp; Historical Trends: Identify patterns to optimize space efficiency.</li>
                    <li className="list-['🛡️'] py-1">&nbsp; Security at its Core: Ensure safety with advanced security features.</li>
                    <li className="list-['🔗'] py-1">&nbsp; Seamless Integration: Effortlessly sync with existing systems.</li>
                    <li className="list-['️⚙️'] py-1">&nbsp; Customization Options: Tailor the dashboard to your unique needs.</li>
                </ul>
                <Link href="/dashboard" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Visit Dashboard
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default Hero;