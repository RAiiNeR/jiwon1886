import React, { useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import Calender from './home/Calender'
import Notification from './home/Notification'
import { ageData, ageOptions } from './memberChart/MemberAge'
import RequireAuth from './comp/RequireAuth'
import { compleChartData, compleChartOptions } from './comleChart/CompleChart'

const Home: React.FC = () => {
    const [rerandering1, setRerandering1] = useState(1);
    const [rerandering2, setRerandering2] = useState(1);

    const reranderer1 = () => {
        setTimeout(() => {
            if (ageData.datasets[0].data.length === 0) {
                reranderer1();
            } else {
                setRerandering1(rerandering1 * -1);
            }
        }, 10);
    }

    const reranderer2 = () => {
        setTimeout(() => {
            if (compleChartData.datasets[0].data.length === 0) {
                reranderer2();
            } else {
                setRerandering2(rerandering2 * -1);
            }
        }, 10);
    }

    useEffect(() => {
        reranderer1();
    }, [ageData.datasets[0].data]);


    useEffect(() => {
        reranderer2();
    }, [compleChartData.datasets[0].data]);

    return (
        <RequireAuth>
            <div className='home'>
                <div className='tab'>
                    <Line key={rerandering1} options={ageOptions} data={ageData} />
                </div>
                <div className='tab'>
                    <Bar key={rerandering2} data={compleChartData} options={compleChartOptions} />
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