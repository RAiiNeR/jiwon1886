import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/PromoteBoardDetail.css';
import Map from './Map';
import RequireAuth from '../comp/RequireAuth';
//데이터 구조 
interface PromoteBoardVO {
    num: number;
    title: string;
    writer: string;
    content: string;
    hit: number;
    imgNames: string[];    // 첨부 이미지 파일명 목록
    pdate: string;
    placeaddr: string;
    placename: string;
    latitude: number;// 위도
    longitude: number;      // 경도
}


// interface PromoteBoardVO {
//     NUM: number;
//     TITLE: string;
//     WRITER: string;
//     CONTENT: string;
//     HIT: number;
//     IMGNAME: string[] ;
//     PDATE: string;
// }

// declare global {
//     interface Window {
//         kakao: any;
//     }
// }

const PromoteBoardDetail: React.FC = () => {
    const { num } = useParams<{ num: string }>();// URL에서 글 번호 가져오기
    console.log("Current Num: ", num);
    const [promoteBoard, setPromoteBoard] = useState<PromoteBoardVO | null>(null);// 현재 글 상세 정보
    const [nextDetail, setNextDetail] = useState<PromoteBoardVO | null>(null); // 다음 글 정보
    const [prevDetail, setPrevDetail] = useState<PromoteBoardVO | null>(null);// 이전 글 정보
    const [mapData, setMapData] = useState<any>(); // 지도에 표시할 데이터
    const navigate = useNavigate();
    const currentNum = parseInt(num as string);// URL로부터 가져온 num을 숫자로 변환
    const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`;
    // 글 상세 정보와 이전/다음 글 정보를 가져오는 함수
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // console.log(1,num) -> currentNum이 null인지 확인하기 null일 경우 ,num도 같이이 확인 해보기 
                // 현재 글의 상세 정보를 서버에서 가져옵니다
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/promote/detail?num=${currentNum}`);
                console.log('Fetched Data:', response.data); // 데이터 확인을 위해 로그 추가
                setPromoteBoard(response.data);

                // 이전 글 정보 가져오기
                if (currentNum > 1) {
                    const prevResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/promote/detail?num=${currentNum - 1}`);
                    setPrevDetail(prevResponse.data);
                } else {
                    setPrevDetail(null);
                }

                // 다음 글 정보 가져오기
                const nextResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/promote/detail?num=${currentNum + 1}`);
                if (nextResponse.data) {
                    setNextDetail(nextResponse.data);
                } else {
                    setNextDetail(null);
                }

            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };
        fetchDetail();
    }, [currentNum]);

    useEffect(() => {
        setMapData({
            placeaddr: promoteBoard?.placeaddr,
            placename: promoteBoard?.placename,
            latitude: promoteBoard?.latitude,
            longitude: promoteBoard?.longitude,
        })
    }, [promoteBoard])
    // 이전 글로 이동
    const handlePrevClick = () => {
        if (currentNum > 1) {
            navigate(`/noorigun/promote/${currentNum - 1}`);
        }
    };
    // 다음 글로 이동
    const handleNextClick = () => {
        navigate(`/noorigun/promote/${currentNum + 1}`);
    };

    // 메인 페이지로 이동
    const handleMainPageClick = () => {
        navigate('/noorigun/promote');
    };
    // 글 삭제 처리
    
    const handleDelete = async () => {
        if(window.confirm("정말로 삭제하시겠습니까?")){
        try {
            await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/promote?num=${currentNum}`);
            navigate('/noorigun/promote'); // 삭제 후 메인 페이지로 이동
        } catch (error) {
            console.log('Error Message: ' + error);
        }
    };
};
    // 글 수정 페이지로 이동
    const handleUpdate = () => {
        navigate(`/noorigun/promote/update/${currentNum}`); // 수정 페이지로 이동
    };

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    if (!promoteBoard) {
        return <div>로딩 중...</div>;
    }

    return (
        <RequireAuth>
            <div className="PromoteboardDetail">
                <div className='container'>
                    <div className="title-section">{promoteBoard.title}</div>

                    {promoteBoard && (
                        <>
                            <div className="info-container">
                                <span className="info-left">작성자: {promoteBoard.writer}</span>
                                <span className="info-right">조회수: {promoteBoard.hit}</span>
                                <span className="info-right">{formatDate(promoteBoard.pdate)}</span>
                            </div>
                            {/* 글 내용 및 첨부 이미지 */}
                            <div className="content-section">
                                {/* imgNames가 null이면 map을 사용할 없다 -> imgNames && */}
                                {promoteBoard.imgNames && promoteBoard.imgNames.map((item, index) => (
                                    <img key={index} className="styled-image" src={filePath + item} alt={promoteBoard.title} />
                                ))}
                                <p>{promoteBoard.content}</p>
                            </div>
                            {/* 지도 컴포넌트 */}
                            {
                                mapData && (
                                    <Map map={mapData} />
                                )
                            }
                            {/* 첨부 파일 링크 */}
                            <div className="attachment">
                                <p>첨부파일:
                                    <a href="#">{promoteBoard.title}.pdf</a>
                                </p>
                            </div>
                            {/* 내비게이션 */}
                            <div className="navigation-section">
                                <div className="nav-item">
                                    {prevDetail && (
                                        <>
                                            <p>이전글:
                                                <a href='#' onClick={handlePrevClick}>{prevDetail.title}</a>
                                            </p>
                                            <span>{formatDate(prevDetail.pdate)}</span>
                                        </>
                                    )}
                                </div>

                                <div className="nav-item">
                                    {nextDetail && (
                                        <>
                                            <p>다음글:
                                                <a href='#' onClick={handleNextClick}>{nextDetail.title}</a>
                                            </p>
                                            <span>{formatDate(nextDetail.pdate)}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className='register-btn-container'>
                                <button className="btn btn-warning" onClick={handleUpdate}>수정</button>
                                <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
                            </div>

                            <div className="button-container">
                                <button className="main-button" onClick={handleMainPageClick}>
                                    메인 페이지로
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </RequireAuth>
    );
};

export default PromoteBoardDetail;
