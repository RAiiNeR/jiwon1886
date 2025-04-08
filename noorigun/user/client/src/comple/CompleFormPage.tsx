import React from 'react'
import SideNav from '../SideNav'
import CompleBoardForm from './CompleBoardForm'
import RequireAuth from '../comp/RequireAuth'

const CompleFormPage: React.FC = () => {
    const sidenav = {
        title: '민원현황', // 사이드 네비게이션 제목
        list: [{
            link: '/noorigun/comple',
            text: '민원현황',
            now: true // 현재 활성화된 링크 표시
        }, {
            link: '/noorigun/comple/chart',
            text: '부서별 민원통계'
        }]
    }

    return (
        <RequireAuth>
            <div className="main">
                {/* 왼쪽에 사이드 네비게이션 표시 */}
                <SideNav sideNavData={sidenav} />
                <div className="overflow-auto section">
                    <CompleBoardForm />
                </div>
            </div>
        </RequireAuth>
    )
}

export default CompleFormPage