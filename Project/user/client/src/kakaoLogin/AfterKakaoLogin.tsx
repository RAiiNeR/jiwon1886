import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const AfterKakaoLogin: React.FC = () => {
    const { code } = useParams();

    const getToken = async () => {
        console.log(code);
        const response = await axios.post("https://kauth.kakao.com/oauth/token", {
            grant_type: "authorization_code",
            client_id: `${process.env.REACT_APP_KAKAO_API_KEY}`,
            redirect_uri: `${process.env.REACT_APP_KAKAO_REDIRECT_URI}`,
            code: code,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
        });
        localStorage.setItem("kakaoToken", response.data.access_token);

        window.close();
    }

    useEffect(() => {
        window.addEventListener('unload', () => {
            window.opener.postMessage({}, '*');
        })
        if (code) {
            getToken();
        }
    }, [code])

    return (
        <div className='kakao-logining'>
            카카오 로그인 진행 중~
        </div>
    )
}

export default AfterKakaoLogin