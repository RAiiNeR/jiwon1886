import React, { useEffect } from 'react'
import './css/KakaoLogin.css'

const KakaoLogining: React.FC = () => {
    const link = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code&scope=account_email,name,birthyear,birthday,phone_number,gender&prompt=login`; //&prompt=login

    useEffect(() => {
        window.open(link, '_self');
    }, []);

    return (
        <div className='kakao-logining'>
        </div>
    )
}

export default KakaoLogining