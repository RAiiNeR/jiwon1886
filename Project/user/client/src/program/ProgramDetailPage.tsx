import React from 'react'
import SideNav from '../SideNav'
import ProgramDetail from './ProgramDetail'
import RequireAuth from '../comp/RequireAuth'

const ProgramDetailPage: React.FC = () => {
    const sidenav = {
        title: '시민 공간', // 사이드 네비게이션 제목
        list: [{
            link: '/freeboard',
            text: '자유게시판'
        }, {
            link: '/program',
            text: '자유게시판',
            now: true // 현재 활성화된 링크 표시
        }, {
            link: '/rent',
            text: '비품 대여'
        }]
    }
    return (
        <RequireAuth>
            <div className="main">
                {/* 왼쪽에 사이드 네비게이션 표시 */}
                <SideNav sideNavData={sidenav} />
                {/* 오른쪽에 제안 상세 내용 표시 */}
                <div className="float-start section">
                    <ProgramDetail />
                </div>
            </div>
        </RequireAuth>
    )
}

export default ProgramDetailPage