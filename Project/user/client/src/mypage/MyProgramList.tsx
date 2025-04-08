import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { parseJwt } from '../comp/jwtUtils';
import './css/MyProgramList.css'

interface ProgramVO {
    NUM: number;
    TITLE: string;
    TEACHER: string;  //강사명명
    STARTTIME: string;//시작시간
    ENDTIME: string;  //종료시간
}

const MyProgramList: React.FC = () => {
    const { id } = useParams();
    const [stateList3, setStateList3] = useState<ProgramVO[]>([]);

    useEffect(() => {
        const getProgram = async () => {
            const token = localStorage.getItem('token'); // JWT 토큰을 로컬 스토리지에서 가져옴
            if (!token) {
                console.error('토큰이 없습니다.');
                return;
            }
            const decodedToken = parseJwt(token); // JWT 디코딩
            const num = decodedToken.num; // 사용자 ID (회원 번호)
            try {
                const response = await axios.get(`http://localhost:81/noorigun/api/mypage/program?num=1`);
                console.log(response.data.programList);  //서버 응답 확인
                setStateList3(response.data.programList);  //프로그램 상태 업데이트
            } catch (error) {
                console.log('오류발생 : ', error);
            }
        }
        getProgram();
    }, [id]);
    
    return (
        <div className='myProgramlist'>
            <h2>개인 신청 현황</h2>
            <div className='row'>
                <table className="myprogram-table">
                    <thead>
                        <tr>
                            <th>강좌명</th>
                            <th>강사명</th>
                            <th>시작시간</th>
                            <th>종료시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stateList3.map((item) => (
                            <tr key={item.NUM}>
                                <td>{item.TITLE}</td>
                                <td>{item.TEACHER}</td>
                                <td>{item.STARTTIME}</td>
                                <td>{item.ENDTIME}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyProgramList