import getTimeSlices from '@/lib/gettimeslice';

export default async function TimeSliceList() {
    const timeslice = await getTimeSlices();
    return (
        <div className="relative overflow-x-auto pt-24">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center p-8">Time Slices</h1>
            </div>
            <table className="m-auto w-[80vw] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                            People
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lidar 1 Distance
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lidar 2 Distance
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lidar 1 Update Frequency
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lidar 2 Update Frequency
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lidar 1 Internal Temperature
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lidar 2 Internal Temperature
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {timeslice.map((t) => (
                        <tr key={t._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {t.time.toString()}
                            </th>
                            <td className="px-6 py-4">
                                {t.people}
                            </td>
                            <td className="px-6 py-4">
                                {t.lidar1CurrentDistance}
                            </td>
                            <td className="px-6 py-4">
                                {t['lidar2CurrentDistance']}
                            </td>
                            <td className="px-6 py-4">
                                {t['lidar1CurrentUpdateFrequency']}
                            </td>
                            <td className="px-6 py-4">
                                {t['lidar2CurrentUpdateFrequency']}
                            </td>
                            <td className="px-6 py-4">
                                {t['lidar1CurrentTemperature']}
                            </td>
                            <td className="px-6 py-4">
                                {t['lidar2CurrentTemperature']}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}