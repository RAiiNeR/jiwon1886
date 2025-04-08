import React from 'react'
import SuggestionList from './SuggestionList'
import SideNav from '../SideNav'

const SuggestionListPage: React.FC = () => {
  const sidenav = {
    title: '소통⦁참여', // 사이드 네비게이션 제목
    list: [{
      link: '/suggestion',
      text: '제안목록',
      now: true // 현재 활성화된 링크 표시
    }, {
      link: '/qna',
      text: '질문/답변'
    },{
      link: '/survey',
      text: '설문조사'
    }]
  }

  return (
    <div className="main">
      <SideNav sideNavData={sidenav} />
      <div className="float-start section">
        <SuggestionList/>
      </div>
    </div>
  )
}

export default SuggestionListPage