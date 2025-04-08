import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { isExists } from 'date-fns';
import { AppDispatch } from './store';
import { socaillogin } from './action/authAction';


const Kakaologin = () => {
  const { token } = useParams();
  const [socialuser, setSocialuser] = useState<any>()


  const parseKakaoToken = async (token: string) => {
    const res = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
    });
    const data = { ...res.data.kakao_account, role: 'USER' }
    return data;
  }

  const checkMember = async () => {
    if (token) {
      const decodeToken = await parseKakaoToken(token);
      const ssn = decodeToken.birthyear.slice(2) + decodeToken.birthday + '-' + (decodeToken.gender === "male" ? parseInt(decodeToken.birthyear.slice(0, 2)) >= 20 ? '3' : '1' : parseInt(decodeToken.birthyear.slice(0, 2)) >= 20 ? '4' : '2')
      const data = {
        name: decodeToken.name,
        username: decodeToken.email,
        code: ssn,
        phone: '0' + decodeToken.phone_number.split(" ")[1].replaceAll('-', ''),
        email: decodeToken.email,
      }
      return data;
    }
  }

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    window.addEventListener('unload', () => {
      window.opener.postMessage({}, '*');
    })
    checkMember().then(async (res) => {
      console.log(res)
      if (res) await dispatch(socaillogin(res.name, res.email, res.code, res.phone, res.email));
    }).then(() => { window.close(); })
  }, [])

  return (
    <div style={{ background: 'white', width: '100vw', height: '100vh' }}>
    </div>
  )
}

export default Kakaologin