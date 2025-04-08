import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import Calender from './home/Calender'
import Notification from './home/Notification'
import { ageData, ageOptions } from './memberChart/MemberAge'
import RequireAuth from './comp/RequireAuth'
import { compleChartData, compleChartOptions } from './comleChart/CompleChart'

const Home: React.FC = () => {


    return (
        <RequireAuth>
            <div className='home'>
                <div className='tab'>
                    <Line options={ageOptions} data={ageData} />
                </div>
                <div className='tab'>
                    <Bar data={compleChartData} options={compleChartOptions}/>
                </div>
                <div className='tab'>
                    <Notification />
                </div>
                <div className='tab'>
                    <Calender />
                </div>
            </div>
        </RequireAuth>
    )
}

export default Home