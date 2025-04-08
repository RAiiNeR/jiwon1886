import React from 'react'
import SideNav from '../SideNav'
import QnaBoardForm from './QnaBoardForm'
import RequireAuth from '../comp/RequireAuth'

const QnaBoardFormPage: React.FC = () => {
  const sidenav = {
    title: '소통⦁참여', // 사이드 네비게이션 제목
    list: [{
      link: '/suggestion',
      text: '제안목록'
    }, {
      link: '/qna',
      text: '질문/답변',
      now: true // 현재 활성화된 링크 표시
    },{
      link: '/survey',
      text: '설문조사'
    }]
  }

  return (
    <RequireAuth>
      <div className="main">
        {/* 왼쪽에 사이드 네비게이션 표시 */}
        <SideNav sideNavData={sidenav} />
        <div className="float-start section">
          <QnaBoardForm />
        </div>
      </div>
    </RequireAuth>
  )
}

export default QnaBoardFormPage