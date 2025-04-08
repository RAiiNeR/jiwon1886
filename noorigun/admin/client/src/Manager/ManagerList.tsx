import React, { useEffect, useState } from 'react'
import RequireAuth from '../comp/RequireAuth'
import axios from 'axios';
import PageNation from '../comp/PageNation';
import './css/Manager.css'

// 회원 데이터 타입 정의
interface Manager {
    NUM: number;
    ID: string;
    NAME: string;
    ROLE: string;
    IMGNAME: string;
    DNAME: string;
    JOINEDDATE: string;
}

const ManagerList: React.FC = () => {
    // 상태 변수: 회원 목록
    const [managers, setManagers] = useState<Manager[]>([]);

    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');

    const getManager = async (page: number, searchValue: string) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/manager`, {
                params: {
                    page: page,
                    size: 10,
                    searchValue: searchValue
                }
            });
            setManagers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log("Error => " + error)
        }
    }

    // 데이터 초기화
    useEffect(() => {
        getManager(page, searchValue);
    }, [page]);

    // 날짜, 시간 형식변경(yyyy-mm-dd hh:mm:ss)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    const handleSearch = () => {
        getManager(1, searchValue);
        setPage(1);
    }

    return (
        <RequireAuth>
            <div style={{ padding: "50px" }}>
                <div className='managerlist'>
                    <h1>관리자 목록</h1>
                    <div className='mb-3'>
                        <input type='text' placeholder='검색어 입력' value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                        <button className='btn btn-primary' onClick={handleSearch}>검색</button>
                    </div>
                    <table className='table table-board'>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>사진</th>
                                <th>이름</th>
                                <th>아이디</th>
                                <th>부서</th>
                                <th>권한</th>
                                <th>입사일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 회원 목록 데이터를 테이블에 렌더링 */}
                            {managers.map((member) => (
                                <tr key={member.ID}>
                                    <td>{member.NUM}</td>
                                    <td>
                                        <img src={`${process.env.REACT_APP_BACK_IMG_URL}/manager/${member.IMGNAME}`} alt=''
                                            style={{ width: '100px', height: '150px' }} />
                                    </td>
                                    <td>{member.NAME}</td>
                                    <td>{member.ID}</td>
                                    <td>{member.DNAME}</td>
                                    <td>{member.ROLE}</td>
                                    <td>{formatDate(member.JOINEDDATE)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <PageNation page={page} totalPages={totalPages} pageChange={setPage} />
                </div>
            </div>
        </RequireAuth>
    )
}

export default ManagerList