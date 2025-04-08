import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { parseKakaoToken } from '../comp/jwtUtils';
import { data } from '../complechart/DummyFile';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../signup/store';
import { socaillogin } from '../signup/action/authAction';

interface SocailLogin {
  username: string;
  email: string;
}

const KaKaologin: React.FC = () => {
  const navigate = useNavigate();
  const [kakaoLoginEnd, setKakaoLoginEnd] = useState('')
  const [socailLogin, setSocailLogin] = useState<SocailLogin>()

  useEffect(() => {
    window.open('/kakaologining', 'newWindow', "width=500,height=600");
    const kakaoLoginEnded = async (e: any) => {
      setKakaoLoginEnd('end')
    }

    window.addEventListener('message', kakaoLoginEnded, false)
  }, [])

  const checkMember = async () => {
    const token = localStorage.getItem('kakaoToken');
    if (token) {
      const decodeToken = parseKakaoToken(token);
      const formData = {
        name: '',
        phone: '',
        email: '',
      }
      await decodeToken.then(data => {
        formData.name = data.name;
        formData.email = data.email;
        formData.phone = '0' + data.phone_number.substring(4).replaceAll('-', '');
        setSocailLogin({ username: data.name, email: data.email })
      })
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/member/socialCheck`,
          formData
        );
        if (response.data === 0) {
          setSocailLogin(undefined);
        }
        return response.data;
      } catch (error) {

      }
    }

  }
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (kakaoLoginEnd) {
      checkMember().then(async (data) => {
        if (data === 0) {
          setSocailLogin(undefined)
          navigate('/socialSignUp')
        }
      })
    }
  }, [kakaoLoginEnd])

  useEffect(() => {
    const socail = async () => {
      await dispatch(socaillogin(socailLogin?.username as string,
        socailLogin?.email as string));
      navigate('/')
    }
    if (socailLogin) {
      socail();
    }
  }, [socailLogin])

  return (
    <div></div>
  )
}

export default KaKaologin