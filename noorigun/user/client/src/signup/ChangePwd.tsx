import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const ChangePwd: React.FC = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const navigate = useNavigate();

    const handleChangePw = async () => {
        if (pw !== confirmPw){
            alert('비밀번호가 일치하지 않않습니다.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/changePwd`, {
                username: id,
                password: pw
            });
            if(response.status === 403){
                alert('아이디가 잘못되었습니다.');
            }
            if(response.status === 200){
                navigate('/noorigun/login')
            }
        } catch (error) {

        }
    }

    return (
        <div className='main_container'>
            <div className='loginModal'>
                <div className="login_article">
                    <div className="title"><em style={{ width: "100%", textAlign: "center" }} id="login_title">비밀번호 변경</em></div>
                    <div className="content">
                        <div id="login_content">
                            <form id="frm">
                                <div className="input_group">
                                    <input type="text" id="id" name="id" value={id} onChange={e => setId(e.target.value)} placeholder="ID" />
                                </div>
                                <div className="input_group" id="pw_group">
                                    <input type="password" id="pw" name="pw" value={pw} onChange={e => setPw(e.target.value)} placeholder="CHANGE PASSWORD" />
                                </div>
                                <div className="input_group" id="pw_group">
                                    <input type="password" id="pw" name="pw" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="CONFIRM PASSWORD" />
                                </div>
                            </form>

                            <div className="btn_zone">
                                <a onClick={handleChangePw} className="btn active_btn w-50" id="btn_login">비밀번호 변경</a>
                                <a href='/noorigun/login' className="btn active_btn w-50" id="btn_login">취소</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePwd