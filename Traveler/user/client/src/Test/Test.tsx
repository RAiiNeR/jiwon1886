import React, { useEffect, useState } from 'react'
import { updateHeight } from '../Comm/CommomFunc';
import { useNavigate } from 'react-router-dom';

const Test: React.FC = () => {

  useEffect(() => {
    // js-fullheight 클래스를 가진 요소의 높이를 화면의 크기로 갱신
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div>
      <div className="hero-wrap js-fullheight" style={{ /*backgroundImage: "url('/images/bg_5.jpg')",*/ backgroundColor: "black" }}>
      </div>
    </div>
  )
}

export default Test