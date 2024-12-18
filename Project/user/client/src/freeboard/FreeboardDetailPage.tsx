import React from 'react'
import { useParams } from 'react-router-dom'
import SideNav from '../SideNav';
import RequireAuth from '../comp/RequireAuth';
import FreeboardDetail from './FreeboardDetail';


const FreeboardDetailPage: React.FC = () => {
    const { num } = useParams();  // URL에서 num 파라미터를 가져옴 -> 현재 게시글의 번호

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
                    {/* FreeboardDetail 컴포넌트를 호출하며 num을 props로 전달 */}
                    <FreeboardDetail num={num as string} />
                </div>
            </div>
        </RequireAuth>

    )
}

export default FreeboardDetailPage;