import React from 'react'
import { Link } from 'react-router-dom'
import Banner from './banner/Banner'


const Home: React.FC = () => {

  return (
    <div className='main'>
      <div className='home'>
        <Banner/>
        <div className='item'>
          <div className='icon'>
            <Link to='/nooriGunEmployee'><i className="fa-solid fa-sitemap"><p>조직도</p></i></Link>
          </div>
          <div className='icon'>
            <Link to='/complaintProcese'><i className="fa-solid fa-list"><p>행정절차</p></i></Link>
          </div>
          <div className='icon'>
            <Link to='/comple/new'><i className="fa-regular fa-clipboard"><p>민원신청</p></i></Link>
          </div>
          <div className='icon'>
            <Link to='/promote'><i className="fa-regular fa-lightbulb"><p>행사안내</p></i></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home