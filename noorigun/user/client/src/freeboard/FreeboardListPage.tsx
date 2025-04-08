import React from 'react'
import SideNav from '../SideNav';
import FreeboardList from './FreeboardList';


const FreeboardListPage: React.FC = () => {

    const sidenav = {
        title: '시민 공간', // 사이드 네비게이션 제목
        list: [{
            link: '/noorigun/freeboard',
            text: '자유게시판',
            now: true // 현재 활성화된 링크 표시
        }, {
            link: '/noorigun/program',
            text: '강좌신청'
        }, {
            link: '/noorigun/rent',
            text: '비품 대여'
        }]
    }

    return (
        <div className="main">
            {/* 왼쪽에 사이드 네비게이션 표시 */}
            <SideNav sideNavData={sidenav} />
            <div className="overflow-auto section">
                <FreeboardList />
            </div>
        </div>

    )
}

export default FreeboardListPage;