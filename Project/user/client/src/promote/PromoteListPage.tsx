import React from 'react'
import PromoteList from './PromoteList'
import SideNav from '../SideNav'

const PromoteListPage: React.FC = () => {
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
        <PromoteList/>
      </div>
    </div>
  )
}

export default PromoteListPage