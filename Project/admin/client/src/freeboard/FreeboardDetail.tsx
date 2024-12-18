import React, { useEffect, useState } from 'react';
import './css/FreeboardDetail.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Fcomments from './Fcomments';
import RequireAuth from '../comp/RequireAuth';

//게시판 정보
interface FreeBoardVO {
    num: number;
    title: string;
    writer: string;
    content: string;
    img_names: string[];
    hit: number;
    fdate: string;
}

const FreeboardDetail: React.FC = () => {
    // 게시물 데이터 (제목, 설명, 사진)
    const { num } = useParams();//num 값으로 해당 글 가져오기
    const [freeBoard, setFreeBoard] = useState<FreeBoardVO>();
    const [showFcomments, setShowFcomments] = useState(false);
    const navigate = useNavigate();
    const filePath = 'http://localhost:82/noorigun/uploads/';
    //특정 게시판 정보 가져오기
    useEffect(() => {
        const getDetail = async () => {

            try {
                const response = await axios.get('http://localhost:82/noorigun/api/freeboard/detail?num=' + num);
                setFreeBoard(response.data);
            } catch (error) {
                console.log('Error Message:' + error);
            }
        }

        getDetail();
    }, [num]);
    //특정 게시판 삭제
    const handleDelete = async () => {
        if(window.confirm("정말로 삭제하시겠습니까?")){
        try {
            const response = await axios.delete('http://localhost:82/noorigun/api/freeboard?num=' + num);
            console.log(response.data);
            navigate('/freeboard');
        } catch (error) {
            console.log('Error Message:' + error);
        }
    }
};
    const toggleComments = () => {
        setShowFcomments((prev) => !prev);
    };

    if (!freeBoard) {
        return <div>로딩중</div> //freeBoard가 없으면 로딩중 메세지가 표시됨
    };
    return (
        <RequireAuth>
            <div style={{ padding: '50px' }}>
                <div className="reply-container">
                    <div className="post-content">
                        <h3>{freeBoard.title}</h3>

                        {/* 가로 라인 추가 */}
                        <hr className="divider" />
                        <p>번호: {freeBoard.num}</p>
                        <p>작성자: {freeBoard.writer}</p>
                        <p>내용: {freeBoard.content}</p>
                        <p>작성일: {freeBoard.fdate}</p>
                        {//배열이 존재하고, 배열의 길이가 0보다 큰 경우(이미지가 존재하는 경우)
                            freeBoard.img_names && freeBoard.img_names.length > 0 ? (
                                //배열 순회해서 이미지를 렌더링
                                freeBoard.img_names.map((item, index) => (
                                    <img key={index} src={filePath + item} alt={freeBoard.title}
                                        style={{ width: '150px', height: '150px' }} />
                                ))
                            ) : (
                                <p>이미지가 없습니다.</p>
                            )
                        }
                        <p></p>
                        <div className='btns'>
                            <button className='btn btn-primary'><Link to={'/freeboard'}>BACK</Link></button>
                            <button type='button' onClick={handleDelete} className='btn btn-danger'>삭제</button>
                            {/* 댓글을 보이거나 숨기는 기능 */}
                            <button onClick={toggleComments} className='btn btn-primary'>
                                {showFcomments ? "댓글 숨기기" : "댓글 보기"}
                            </button>
                        </div>
                    </div>
                    {/* 가로 라인 추가 */}
                    <hr className="divider" />
                </div>

                {showFcomments && (
                    <Fcomments fbnum={freeBoard.num} />
                )}
            </div>
        </RequireAuth>
    );
}


export default FreeboardDetail;