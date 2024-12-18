import React from 'react'
import CompleChart from './CompleChart'
import SideNav from '../SideNav'

const CompleChartPage: React.FC = () => {
    const sidenav = {
        title: '민원현황', // 사이드 네비게이션 제목
        list: [{
            link: '/comple',
            text: '민원현황'
        }, {
            link: '/comple/chart',
            text: '부서별 민원통계',
            now: true // 현재 활성화된 링크 표시
        }]
    }

    return (
        <div className="main">
            {/* 왼쪽에 사이드 네비게이션 표시 */}
            <SideNav sideNavData={sidenav} />
            <div className="overflow-auto section">
                <CompleChart />
            </div>
        </div>
    )
}

export default CompleChartPage