import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface RequireAuthProps{
  children: React.ReactNode
}

const RequireAuth: React.FC<RequireAuthProps> = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthhorized, setIsAuthhorized] = useState(true);

  useEffect(()=>{
    const token = localStorage.getItem('managerToken');
    // console.log("Token => "+token);
    // console.log("location.pathname => "+location.pathname);
    // 로그인 처리시 활성화 필요
    if(!token){
      setIsAuthhorized(false);
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    }
  },[navigate, location.pathname]);

  if(isAuthhorized === null || !isAuthhorized){
    return null;
  }
  return <>{children}</>
}

export default RequireAuth