import React from 'react'
import SideNav from '../SideNav';
import CompleBoardEditForm from './CompleBoardEditForm';
import { useParams } from 'react-router-dom';
import RequireAuth from '../comp/RequireAuth';

const CompleBoardEditFormPage: React.FC = () => {
    const { num } = useParams(); // URL에서 num 파라미터를 가져옴 -> 현재 게시글의 번호

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
                    {/* CompleBoardEditForm 컴포넌트를 호출하며 num을 props로 전달 */}
                    <CompleBoardEditForm num={num as string} />
                </div>
            </div>
        </RequireAuth>
    )
}

export default CompleBoardEditFormPage