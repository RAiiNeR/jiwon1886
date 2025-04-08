import React from 'react'
import { useParams } from 'react-router-dom'
import CompleChartDetail from './CompleChartDetail'
import SideNav from '../SideNav';

const CompleChartDetailPage: React.FC = () => {
    const { deptno } = useParams<{ deptno: string }>();

    const sidenav = {
        title: '민원현황', // 사이드 네비게이션 제목
        list: [{
            link: '/noorigun/comple',
            text: '민원현황'
        }, {
            link: '/noorigun/comple/chart',
            text: '부서별 민원통계',
            now: true // 현재 활성화된 링크 표시
        }]
    }

    return (
        <div className="main">
            {/* 왼쪽에 사이드 네비게이션 표시 */}
            <SideNav sideNavData={sidenav} />
            <div className="overflow-auto section">
                {/* CompleChartDetail 컴포넌트를 호출하며 num을 props로 전달 */}
                <CompleChartDetail deptno={deptno as string} />
            </div>
        </div>
    )
}

export default CompleChartDetailPage