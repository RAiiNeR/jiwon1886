import React from 'react'

const MyPage: React.FC = () => {
  return (
    <div>
      <div className='mypage'>
        <h2>나의 누리</h2>
        <table>
          <tbody>
            <tr>
              <th>이름</th>
              <td>테스형</td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>010-1234-5678</td>
            </tr>
            <tr>
              <th>e-mail</th>
              <td>nooridawon0317@naver.com</td>
            </tr>
            <tr>
              <th>주소</th>
              <td>누리시 누리동 101호</td>
            </tr>
          </tbody>
        </table>

        <div className='mypage-box'>
          <p>지금 </p>
          <div className='left-box'>
            <span>내가 신청한 민원은?</span>
            <h2>민원</h2>
          </div>

          <div className='right-box'>

          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage