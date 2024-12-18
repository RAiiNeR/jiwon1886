import React, { useEffect, useState } from 'react';
import './css/FreeBoardDetail.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Fcomments from './Fcomments';


interface FreeBoardVO {
    num: number;
    title: string;
    writer: string
    content: string;
    img_names: string[]
    hit: number;
    fdate: string;
}

const FreeboardDetail: React.FC<{ num: string }> = ({ num }) => { // num을 props

    const [freeBoard, setfreeBoard] = useState<FreeBoardVO>();
    const navigate = useNavigate();
    const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/` // 이미지 파일 경로

    useEffect(() => { // 항목에 해당하는 번호를 게시물로 보여주는 것(비동기식)
        const getDetail = async () => {
            try {
                const response = await axios.get
                    (`${process.env.REACT_APP_BACK_END_URL}/api/freeboard/` + num);
                setfreeBoard(response.data); // 게시글 데이터 저장
            } catch (error) {
                console.log('Error Message: ' + error);
            }
        }
        getDetail();
    }, [num]) // num이 변경될 때마다 실행

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    // 게시글 삭제
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/freeboard?num=` + num);
            console.log(response.data); // 성공 로그
            navigate("/freeboard"); // 삭제 후 목록 페이지로 이동
        } catch (error) {
            console.log('Error Message: ' + error); // 에러 로그
        }
    }

    if (!freeBoard) {
        return <div>로딩중~</div>
    }
    return (

        <div>
            <div className="reply-container">
                <div className="post-content">
                    <h3>{freeBoard.title}</h3>

                    {/* 가로 라인 추가 */}
                    <hr className="divider" />
                    <p>번호:{freeBoard.num}</p>
                    <p>작성자:{freeBoard.writer}</p>
                    <p>내용:{freeBoard.content}</p>
                    <p>작성일:{formatDate(freeBoard.fdate)}</p>
                    {
                        freeBoard.img_names.map((item, index) => (
                            <img key={index} src={filePath + item} alt={freeBoard.title}
                                style={{ width: '150px', height: '150px' }} />
                        ))
                    }
                    <p></p>
                    <Link to={'/freeboard'} className="list-btn">리스트</Link>
                    <button type='button' className="delete-btn" onClick={handleDelete}>삭제</button>
                </div>

                {/* <button type="button" className="QnAD-btn QnAD-btn-danger" onClick={handleDelete}>
        삭제
      </button> */}

                {/* <p><button className='before'><Link to='/FreeList'>이전 페이지</Link></button></p> */}

                {/* 작성자와 작성일자 간격띄우기
                    <p className='poser-date'>
                        <span className="writer">{freeBoard.writer}</span>
                        <span className="date">{freeBoard.fdate}</span></p>

                    {/* 게시물 이미지와 설명 */}
                {/* <div className="post-details">
                        <img src={freeBoard.imageSrc} alt="사진" className="post-image" />
                        <p>{freeBoard.description}</p>
                    </div>
                </div>  */}

                {/* 가로 라인 추가 */}
                <hr className="divider" />

                <Fcomments fbnum={freeBoard.num} />
            </div>
        </div>
    );

};

export default FreeboardDetail;