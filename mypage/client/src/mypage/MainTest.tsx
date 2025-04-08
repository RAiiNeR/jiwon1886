import React, { useState } from 'react'
import { Link } from 'react-router-dom'


const MainTest: React.FC = () => {
  return (
    <div>
        <div className='box' style={{width : '200px', height:'80px'}}>
            <Link to={'/mypage'}>마이페이지</Link>
        </div>
    </div>
  )
}

export default MainTest