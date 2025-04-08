import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
/*
  - TypeScript를 사용해 RequireAuth 컴포넌트가 받을 수 있는 props의 타입을 정의
  - props는 React 컴포넌트에 데이터를 전달하기 위해 사용하는 객체
  - RequireAuth 컴포넌트를 사용할 때, 이 컴포넌트가 자식 컴포넌트(children)을 받을 수 있음
*/
interface RequireAuthProps{
  children: React.ReactNode // React 컴포넌트를 자식으로 받음 
}

const RequireAuth: React.FC<RequireAuthProps> = ({children}) => {
  const navigate = useNavigate(); // 페이지 이동 처리
  const location = useLocation(); // 현재 경로 정보
  const [isAuthhorized, setIsAuthhorized] = useState(true); // 사용자가 인증되었는지 여부

  useEffect(()=>{
    const token = localStorage.getItem('token'); // 브라우저 localStorage에서 token키로 저장된 값 가져옴
    // console.log("Token => "+token);
    // console.log("location.pathname => "+location.pathname);
    if(!token){ // 인증토큰 확인 -> 토큰이 없으면
      setIsAuthhorized(false); // 인증 false
      // 로그인 페이지로 리다이렉트, 현재 경로를 쿼리 파라미터로 전달(로그인 후 원래 페이지로 돌아가기 위해)
      navigate(`/traveler/login?redirect=${encodeURIComponent(location.pathname)}`);
    }
  },[navigate, location.pathname]); // 바뀔때 마다 실향

  if(isAuthhorized === null || !isAuthhorized){ // 인증확인X, 인증X
    return null; // 아무것도 보여주지 않음
  }
  return <>{children}</> // 인증되면 자식 컴포넌트 랜더링
}

export default RequireAuth