import React, { useEffect, useState } from 'react';
import { appear_animate, handleScroll, updateHalfHeight } from '../../Comm/CommomFunc';
import { Link, useNavigate } from 'react-router-dom';
import { Provider, LikeButton } from "@lyket/react";
import { BackpackChart, BackpackPieChart } from './BackpackChart'; // 차트 추가
import '../../css/BackpackList.css'
import axios from 'axios';
import Pagenation from '../../Comm/Pagenation';


interface BackPackVO {
    NUM: number;           // 게시글 번호
    MEMBERNAME: string;    // 작성자 이름
    IMG_NAMES: string;    // 이미지 파일 리스트
    TAG: string[];         // 태그 리스트
    TITLE: string;         // 제목
    MEMBERNUM: number;     // 작성자 번호
    CONTENT: string;       // 내용
    HIT: number;
    CDATE: string;
    HEART: number;
}

const BackpackList: React.FC = () => {
    const [backpack, setBackpack] = useState<BackPackVO[]>([]);
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [title, setTitle] = useState(''); // 제목 검색
    const [check, setCheck] = useState(false) // 검색 버튼 동작 감지
    const navigate = useNavigate();
    const itemsPerPage = 8; // 페이지당 항목 수
    const pagePerBlock = 5; // 한 블럭에 표시할 페이지 수
    const filePath = `${process.env.REACT_APP_FILES_URL}/img/backpack`;

    const getBackpackList = async () => {
        console.log(currentPage)
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/backpack/search`, {
                params: {
                    page: currentPage,
                    size: itemsPerPage,
                    title: title,
                },
            });
            console.log('API 응답 데이터:', response.data); // 응답 구조 확인
            const data: any = [...response.data.content];
            setBackpack(data.map((d: any) => {
                return {
                    ...d, memberName: d.name, memberNum: d.num,
                    // TAG: d.TAG ? d.TAG.split(",") : []
                    IMG_NAMES: d.IMG_NAMES ? (Array.isArray(d.IMG_NAMES) ? d.IMG_NAMES : d.IMG_NAMES.split(",")) : [],
                    TAG: d.TAG ? (Array.isArray(d.TAG) ? d.TAG : d.TAG.split(",")) : []
                }
            }));
            setTotalPages(response.data.total_pages); // 전체 페이지 수는 기본 1로 설정 (백엔드에서 제공되지 않음)
        } catch (error) {
            console.error('API 호출 오류:', error);
        }
    };

    useEffect(() => {
        getBackpackList();
    }, [currentPage]); // currentPage 또는 title가 변경된 때만 게시글 리스트을 가져오기

    // 페이지 순서 계산
    useEffect(() => {
        setStartPage((Math.floor((currentPage - 1) / pagePerBlock) * pagePerBlock) + 1); // 시작페이지 계산
        let end = (Math.floor((currentPage - 1) / pagePerBlock) + 1) * pagePerBlock; // 끝페이지 계산
        end = end > totalPages ? totalPages : end; // 총 페이지 수보다 크면 총 페이지 수로
        setEndPage(end);
    }, [backpack]);

    // 제목 클릭 시 게시글 상세페이지로 이동
    const handleTitleClick = (num: number) => {
        navigate(`/traveler/community/${num}`);
    };

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // 검색
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value); // 검색어 입력 시 쓰는 함수(업데이트)
    };

    const handleSearchClick = async () => {
        try {
            console.log("검색 요청 보냄! 검색어:", title);

            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/backpack/search`, {
                params: {
                    title: title, // 검색할 제목
                    page: currentPage, // 현재 페이지 번호
                    pageSize: itemsPerPage, // 한 페이지당 표시할 개수
                },
            });

            console.log("검색 응답 데이터:", response.data); // 디버깅용

            setBackpack(response.data.content); // 검색된 데이터 설정
            setTotalPages(response.data.total_pages); // 백엔드에서 총 페이지 수를 제공하지 않으므로 기본 1 설정
        } catch (error) {
            console.error("검색 오류 발생:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        appear_animate();
    }, [backpack]);

    useEffect(() => {
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => {
            window.removeEventListener("resize", updateHalfHeight);
        };
    }, []);

    return (
        <div className="like-container">
            {/* 헤더 */}
            <div className="hero-wrap js-halfheight backpackImg" style={{ backgroundImage: "url('./images/backpack.jpg')" }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-halfheight align-items-center justify-content-center">
                        <div className="col-md-9 ftco-animate text-center tt-box">
                            <p className="breadcrumbs">
                                <span className="mr-2"><Link to="/traveler/home">Home</Link></span>
                                <span>커뮤니티</span>
                            </p>
                            <h1 className="mb-3 bread">나의 배낭</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container-xl'>
                <div className="search-box">
                    {/* 검색어 입력 */}
                    <div className="search-container">
                        <input
                            type="text"
                            className="form-search"
                            placeholder="검색어를 입력하세요..."
                            value={title}
                            onChange={handleSearchChange} // 검색어 입력 시 상태 업데이트
                        />
                        <button className="btn btn-primary" style={{ cursor: "pointer" }} onClick={handleSearchClick}>
                            검색
                        </button>
                    </div>
                </div>

                {/* 메인 컨텐츠 */}
                <section className="ftco-section megaLikeBox">
                    <div className='chart-container'>
                        <div className='chart-container'>
                            {/* 여행 스타일 분석 (막대 + 꺾은선 그래프) */}
                            <div className="chart-box">
                                <div className="like-chart-container">
                                    <h4 className="like-chart-title">여행 스타일 분석</h4>
                                    <div className="chart-wrapper bar-chart">
                                        <BackpackChart />
                                    </div>
                                </div>
                            </div>

                            {/* 감정 태그 분석 (파이 차트) */}
                            <div className="chart-box">
                                <div className="like-chart-container">
                                    <h4 className="like-chart-title">감정 태그 분석</h4>
                                    <div className="chart-wrapper pie-chart">
                                        <BackpackPieChart />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <Provider apiKey="acc0dbccce8e557db5ebbe6d605aaa">
                                <div className="megabig-backpack">
                                    <div className="big-backpack">
                                        <div className="mini-backpack">
                                            {Array.isArray(backpack) && backpack.length > 0 ? (
                                                backpack.map((item) => (
                                                    <div className="minimini-backpack" key={item.NUM}>
                                                        {/* 이미지 처리 */}
                                                        {/* {item.IMG_NAMES ? (
                                                            <Link to={`/traveler/community/${item.NUM}`}
                                                                className="block-20"
                                                                style={{ backgroundImage: `url(${filePath}/${item.IMG_NAMES})` }}>
                                                            </Link>
                                                        ) : (
                                                            <div className="block-20" style={{ background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
                                                                <p>이미지 없음</p>
                                                            </div>
                                                        )} */}
                                                        {item.IMG_NAMES && item.IMG_NAMES.length > 0 ? (
                                                            <Link to={`/traveler/community/${item.NUM}`}
                                                                className="block-20"
                                                                style={{ backgroundImage: `url(${filePath}/${item.IMG_NAMES[0]})` }}>
                                                            </Link>
                                                        ) : (
                                                            <div className="block-20" style={{ background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
                                                                <p>이미지 없음</p>
                                                            </div>
                                                        )}

                                                        {/* 게시글 정보 */}
                                                        <div className="backpack-textbox">
                                                            <span className="tag">
                                                                {Array.isArray(item.TAG) ? item.TAG.join(", ") : (typeof item.TAG === "string" ? item.TAG : "태그 없음")}
                                                            </span>
                                                            <h3>
                                                                <Link to={`/traveler/community/${item.NUM}`}>{item.TITLE}</Link>
                                                            </h3>
                                                            <p className="hit">조회수: {item.HIT}</p> {/* 조회수 */}
                                                            <p className="date">작성일: {formatDate(item.CDATE)}</p> {/* 작성일 */}
                                                            {/* ❤️ 좋아요 버튼 */}
                                                            <div className="meta mb-3">
                                                                <LikeButton
                                                                    namespace="testing-react"
                                                                    id={`like-button-${item.NUM}`}
                                                                    hideCounterIfLessThan={0}
                                                                    component={({ handlePress, totalLikes }) => (
                                                                        <button onClick={handlePress}
                                                                            style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>
                                                                            ❤️ {totalLikes}
                                                                        </button>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>게시글이 없습니다.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Provider>


                            <div className="row mt-5">
                                <div className="col text-center">
                                    <button
                                        type="submit"
                                        className="write-button"
                                        onClick={() => window.location.href = '/traveler/BackpackForm'} // 페이지 이동
                                    >
                                        작성하기
                                    </button>
                                </div>
                            </div>
                            {/* 페이징 */}
                            {totalPages > 0 && (
                                <Pagenation
                                    page={currentPage}
                                    totalPages={totalPages}
                                    pageChange={handlePageChange}
                                />
                            )}

                        </div>
                    </div>

                </section>
            </div>
        </div>
    )
}

export default BackpackList;