import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './chart.css'

const ChartMain: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/chart');
  }

  const handleClickAdmin = () => {
    navigate('/chartAdmin');
  }

  return (
    <div>
      <div className='main-btn'>
        <button onClick={handleClick}><Link to={'/chart'} className='li-btn'>일반 차트</Link></button>
        <button onClick={handleClickAdmin}><Link to={'/chartAdmin'} className='li-btn'>관리자 차트</Link></button>
      </div>
    </div>
  )
}

export default ChartMain