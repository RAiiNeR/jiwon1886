import React from 'react'
import './css/ComplaintProcese.css'
// 민원 처리 방법과 절차를 안내하는 웹 페이지를 구현
const ComplaintProcese: React.FC = () => {
  return (
    <div className='complaint'>
        <div className='content'>
            <h3 id='content-title'>민원신청방법</h3>
        </div>

        <h3 className='title'>신청대상</h3>
        <p className='item'>누리군(보건소, 문화재단, 센터 포함)에서 처리한 사무 등에 대한 고충민원
            <br/>고충민원은 행정기관 등의 위법 부당하거나 소극적인 처분, 불합리한 행정제도로 인하여 국민의
            권리를 침해하거나 불편, 부담을 주는 사항에 관한 민원을 의미합니다.<br/>
        </p>
        <h3 className='title'>고충민원 제외대상</h3>
        <p className='item'>※다음에 해당하는 경우 관계 행정기관 등에 이송하거나 각하할 수 있습니다.</p>
        <p><img src="images/procese/exclusion.png" alt="asd" /></p>


        <div id='contents-body'>
            <h4 className='title'>서식민원</h4>   
        </div>
        <p>민원을 지정된 양식으로 신청하는 방법안내입니다.</p>
        <h5 className='mtitle '>신청절차</h5>
       <div className='cuty'><ul><li>
            <div className='item'><i className='num'>01. </i><strong className='tit'>
                민원신청 →
                <br/>온라인민원 신청<br/></strong></div>
            </li></ul>

        <ul><li>
            <div className='item'><i className='num'>02. </i><strong className='tit'>
               민원 검색 · 이동</strong></div>
            </li></ul>

        <ul><li>
            <div className='item'><i className='num'>03. </i><strong className='tit'>
               로그인하기</strong></div>
            </li></ul>

        <ul><li>
            <div className='item'><i className='num'>04. </i><strong className='tit'>
               서식 입력 및 제출</strong></div>
            </li></ul></div>

            <h5 className='mtitle'>처리절차</h5>
            <div className='cuty'><ul><li>
            <div className='item'><i className='num'>01. </i><strong className='tit'>
               민원인의 신청</strong></div>
            </li></ul>

            <ul><li>
            <div className='item'><i className='num'>02. </i><strong className='tit'>
                관할부서 접수</strong></div>
            </li></ul>

            <ul><li>
            <div className='item'><i className='num'>03. </i><strong className='tit'>
                관할부서 심의 · 의결</strong></div>
            </li></ul>

            <ul><li>
            <div className='item'><i className='num'>04. </i><strong className='tit'>
              처리결과 통보</strong></div>
            </li></ul></div>

            
        <div id='contents-body'>
            <h4 className='title'>유선민원</h4>   
        </div>
        <p>고령자 · 장애인 등 민원신청서 작성이 어려운 민원인을 위한 편의제도입니다.</p>
        <p>법적근거: 민원처리에 관한 법률 제 8조, 제 10조</p>
        <h5 className='mtitle'>신청방법</h5>
        <p>평일(09:00~18:00) : 해당부서 직접 전화 접수 또는 누리군 통합센터 (국번없이 ☎123)</p>
        <p>토, 일요일 및 법정 공휴일 : 누리군 통합센터 (국번없이 ☎123)</p>

        <div className='admin_info clearfix'>
            <h3 className='title'><span>담당부서정보</span></h3>
            <ul><li>담당국: 문화복지국</li>
            <li>전화번호:010-1234-5678</li></ul>
        </div>
    </div>
  )
}

export default ComplaintProcese