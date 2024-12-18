import React from 'react'
import { useParams } from 'react-router-dom'
import PromoteDetail from './PromoteDetail'
import SideNav from '../SideNav';

const PromoteDetailPage: React.FC = () => {
  const { num } = useParams();
  const sidenav = {
    title: '누리소식', // 사이드 네비게이션 제목
    list: [{
      link: '/promote',
      text: '누리행사',
      now: true // 현재 활성화된 링크 표시
    }, {
      link: '/faq',
      text: '자주하는 질문'
    }]
  }

  return (
    <div className="main">
      {/* 왼쪽에 사이드 네비게이션 표시 */}
      <SideNav sideNavData={sidenav} />
      <div className="float-start section">
        {/* PromoteDetail 컴포넌트를 호출하며 num을 props로 전달 */}
        <PromoteDetail num={num as string} />
      </div>
    </div>
  )
}

export default PromoteDetailPage