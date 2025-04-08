import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import UpBoardComm from './UpboardComm';
//
/*
1) 서버측 데이터의 json을 가지고 인터페이스를 정의한다
2) 비동기식으로 받은 데이터를 저장할 useState에 자료형으로 선언및 생성
3) 상세보기는 반드시 어디를 거쳐서 랜더링이 될까? 즉, 서버로 보낼 num을 받아줄 useParams로 정의
    useParams
4) 즉 컴포넌트가 로딩이 될때 서버에서 데이터를 비동기식으로 받아와서 setUpboard에 저장
    useEffect(() => {},[])에서 구현해야한다
5) aync() => { const response = await, axios.get/post .....}
6) UI에 적절한 값을 배치하거나 핸들링을 할 수 있다
*/
interface UpboardDetail {
    num: number;
    title: string;
    wrtier: string;
    content: string;
    imgn: string;
    hit: number;
    reip: string;
    bdate: string;
    mfile: string | null;
}

const UpboardDetail: React.FC = () => {
    const [upboard, setUpboard] = useState<UpboardDetail | null>(null);
    const { num } = useParams<{ num: string }>();
    const imageBasePath = 'http://192.168.0.90/myictstudy/resources/imgfile/';

    useEffect(() => {
        const fetchUpboardDetail = async () => {
            try {
                const response = await axios.get<UpboardDetail>(`http://192.168.0.90/myictstudy/upboard/updetail?num=${num}`);
                setUpboard(response.data);
            } catch (error) {
                console.log("Error : ", error);
            }
        };

        fetchUpboardDetail();
    }, [num]);

    if (!upboard) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="container mt-5">
                <div className="card">
                    <div className="card-header">
                        <h2>{upboard.title}</h2>
                    </div>
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>작성자: {upboard.wrtier}</strong>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <strong>작성날짜: {upboard.bdate}</strong>
                            </div>
                        </div>
                        <div className="mb-3">
                            <strong>내용</strong>
                            <p>{upboard.content}</p>
                        </div>
                        {upboard.imgn && (
                            <div className="mb-3">
                                <strong>이미지:</strong>
                                <img src={`${imageBasePath}${upboard.imgn}`} alt={upboard.title} className="img-fluid mt-2" />
                            </div>
                        )}
                        <div className="row">
                            <div className="col-md-6">
                                <strong>조회수: {upboard.hit}</strong>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <strong>작성아이피: {upboard.reip}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        {/* 원래 삭제빼고 Link였음 */}
                        <button /*to="/upboard"*/ className="btn btn-primary me-2">리스트</button>
                        <button /*to={`/upboard/edit/${upboard.num}`}*/ className="btn btn-warning me-2">수정</button>
                        <button className="btn btn-danger">삭제</button>
                    </div>
                </div>
                {/* 댓글 컴포넌트 */}
                <UpBoardComm num={upboard.num} />
            </div>
            
        </div>
    )
}

export default UpboardDetail