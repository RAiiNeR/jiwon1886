import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

interface RequireAuthProps{
    children : React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation(); //로그인 전에 위치를 받아오기 위한 hook
    const [isAuthorized, setIsAuthorized] = useState<boolean>(true);

    useEffect(()=> {
        const token = localStorage.getItem('token');
        console.log(`Token => ${token}`);
        console.log(`location.pathname => ${location.pathname}`);
        if (!token) {
            setIsAuthorized(false); //토큰이 없을시 false 지정
            //로그인으로 redirect할때 현재경로의 쿼리도 파라미터로 전달한다.
            navigate(`/back/login?redirect=${encodeURIComponent(location.pathname)}`);
        }
    }, [navigate, location.pathname]);
    if (isAuthorized === null || !isAuthorized) {
        return null;
    }
    //위에서 로그인 즉 토큰이 없으면 로그인 폼으로 이동하고
    //그게 아니면 로그인이 완료되었다 그래서 보여줄 페이지를 랜더링한다.
    return <>{children}</>;
}

export default RequireAuth