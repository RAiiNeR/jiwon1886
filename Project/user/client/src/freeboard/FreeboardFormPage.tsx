import React from 'react'
import SideNav from '../SideNav';
import RequireAuth from '../comp/RequireAuth';
import FreeboardForm from './FreeboardForm';


const FreeboardFormPage: React.FC = () => {

    const sidenav = {
        title: '시민 공간', // 사이드 네비게이션 제목
        list: [{
            link: '/freeboard',
            text: '자유게시판',
            now: true // 현재 활성화된 링크 표시
        }, {
            link: '/program',
            text: '자유게시판'
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
                <div className="overflow-auto section">
                    <FreeboardForm />
                </div>
            </div>
        </RequireAuth>

    )
}

export default FreeboardFormPage;