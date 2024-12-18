import React from 'react'
import SuggestionForm from './SuggestionForm'
import SideNav from '../SideNav'
import RequireAuth from '../comp/RequireAuth'
// SuggestionFormPage 제안 등록을 위한 전체 페이지 구조를 관리하며, 사이드 네비게이션, 제안 등록 폼, 인증 보호를 결합
const SuggestionFormPage: React.FC = () => {
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
    <RequireAuth>
      <div className="main">
        <SideNav sideNavData={sidenav} />
        <div className="float-start section">
          <SuggestionForm />
        </div>
      </div>
    </RequireAuth>
  )
}

export default SuggestionFormPage