import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import "./css/Myshelf.css";
import Pagenation from '../../Comm/Pagenation';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { parseJwt } from '../../Comm/jwtUtils';

interface Diary {
    num: number;
    title: string;
    thumbnail: string;
    isshare: number;
    hit: number;
    heart: number;
    ddate: string;
    membernum: number;
}

const MyBookShelfRe: React.FC = () => {
    const [allPosts, setAllPosts] = useState<Diary[]>([]); // 전체 게시글
    const [selectedDiaries, setSelectedDiaries] = useState<number[]>([]); // 선택된 다이어리 저장
    // const hoverRef = useRef<number | null>(null); // Hover 상태를 useRef로 처리
    const [isShared, setIsShared] = useState<boolean>(false); // 공유된 다이어리와 나의 다이어리 구분 상태

    const [size, setSize] = useState(8); // 한 페이지 당 항목 수
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [startPage, setStartPage] = useState(1);
    const [page, setPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const pagePerBlock = 5; // 한 블럭에 표시할 페이지 수

    
    // const membernum = 1;

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userToken, setUserToken] = useState<number | null>(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        const userNum = parseJwt(token as string).num;
        
            setIsLoggedIn(true);
            setUserToken(userNum);
        } else {
            setIsLoggedIn(false);
        }
    },[]);

    const membernum = userToken;


    //나의 다이어리
    const fetchDiaryList = async (shared: boolean, page: number) => {
        try {
            const endpoint = shared ? "/api/diary/sharediary" : "/api/diary/mydiarylist";
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}${endpoint}`, {
                params: { page, size, membernum },
            });
            console.log("토큰 : ",userToken);
            console.log("API 응답:", response); // 응답 전체 확인
            const formattedData: Diary[] = response.data.content.map((item: any) => ({
                num: item.num,
                title: item.title,
                ddate: item.ddate,
                isshare: item.isshare,
                thumbnail: item.thumbnail,
                hit: item.hit,
                heart: item.heart,
                membernum: item.membernum,
            }));
            
            console.log("형식화된 데이터:", formattedData); // 데이터 형식 확인
            setAllPosts(formattedData);
            setTotalPages(response.data.total_pages);
            console.log("총 페이지 수:", response.data.total_pages);
        } catch (error) {
            console.error("Error fetching diaries:", error);
        }
    };
    
    
    // useEffect 최적화 적용
    useEffect(() => {
        console.log("isShared 상태 변경:", isShared);
        console.log("페이지 상태 변경:", page);
        fetchDiaryList(isShared, page);
    }, [isShared, page, userToken]);
    
    useEffect(() => {
        // isShared 상태 변경 시 페이지를 1로 초기화
        setPage(1);
    }, [isShared]);
    


    // 페이지 블록 계산
        useEffect(() => {
            setStartPage((Math.floor((page - 1) / pagePerBlock) * pagePerBlock) + 1);
            let end = (Math.floor((page - 1) / pagePerBlock) + 1) * pagePerBlock;
            end = end > totalPages ? totalPages : end;
            setEndPage(end);
    }, [page, totalPages]);

    // 페이지 변경
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }


    //다이어리 선택
    const handleSelectDiary = (diaryNum: number) => {
        setSelectedDiaries((prevSelected) =>
            prevSelected.includes(diaryNum)
                ? prevSelected.filter((num) => num !== diaryNum)
                : [...prevSelected, diaryNum]
        );
    };

    // 삭제 버튼
    const handleDeleteSelected = async () => {
        if (selectedDiaries.length === 0) {
            alert("삭제할 다이어리를 선택하세요.");
            return;
        }
        try {
            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_BACK_END_URL}/api/diary`,
                data: selectedDiaries,
            });
            alert("삭제되었습니다.");
            setAllPosts((prevPosts) =>
                prevPosts.filter((diary) => !selectedDiaries.includes(diary.num))
            );
            setSelectedDiaries([]); // 삭제 후 선택된 다이어리 목록 초기화
        } catch (error) {
            console.log("삭제 오류:", error);
        }
    };

    // 공유 버튼
    const handleShareSelected = async () => {
        if (selectedDiaries.length === 0) {
            alert("공유할 다이어리를 선택하세요.");
            return;
        }

        try {
            const response = await axios.put(
                 `${process.env.REACT_APP_BACK_END_URL}/api/diary/share`,
                selectedDiaries, // selectedDiaries 배열
                {
                    headers: {
                        'Content-Type': 'application/json', // JSON 데이터로 보내기
                    },
                }
            );

            if (response.status === 200) {
                setIsShared(true)
                // API 호출 후 로컬 상태 바로 업데이트
                setAllPosts((prevPosts) =>
                    prevPosts.map((diary) =>
                        selectedDiaries.includes(diary.num)
                            ? { ...diary, isshare: 1 } // isshare 값을 1로 업데이트
                            : diary
                    )
                );
                alert("선택된 다이어리가 공유되었습니다.");
                setSelectedDiaries([]); // 공유 후 선택 초기화
            }
        } catch (error) {
            console.error("공유 오류:", error);
            alert("다이어리 공유 실패");
        }
    };

    // 공유 취소
    const handleShareCancelSelected = async () => {
        if (selectedDiaries.length === 0) {
            alert("공유할 다이어리를 선택하세요.");
            return;
        }

        try {
            const response = await axios.put(
                 `${process.env.REACT_APP_BACK_END_URL}/api/diary/noshare`,
                selectedDiaries, // selectedDiaries 배열
                {
                    headers: {
                        'Content-Type': 'application/json', // JSON 데이터로 보내기
                    },
                }
            );

            if (response.status === 200) {
                setIsShared(false)
                // API 호출 후 로컬 상태 바로 업데이트
                setAllPosts((prevPosts) =>
                    prevPosts.map((diary) =>
                        selectedDiaries.includes(diary.num)
                            ? { ...diary, isshare: 0 } // isshare 값을 0으로 업데이트
                            : diary
                    )
                );
                alert("선택된 다이어리가 공유취소되었습니다.");
                setSelectedDiaries([]); // 공유 후 선택 초기화
            }
        } catch (error) {
            console.error("공유 취소 오류:", error);
            alert("다이어리 공유취소 실패");
        }
    };


    return (
        <div className="bookshelf" style={{ paddingTop: "170px" }}>
            <div className="titlebox" style={{ paddingTop: "90px" }}>
                <h2>나의 다이어리</h2>

                <button
                    className="MyDiaryButton"
                    onClick={() => setIsShared(false)} // 나의 다이어리 선택
                    style={{
                        backgroundColor: isShared ? "lightgray" : "darkblue",
                        color: isShared ? "black": "white",
                        height: "40px",
                    }}
                >
                    비밀 다이어리
                </button>
                <button
                    className="ShareDiaryButton"
                    onClick={() => setIsShared(true)} // 공유된 다이어리 선택
                    style={{
                        backgroundColor: isShared ? "darkblue" : "lightgray",
                        color: isShared ? "white": "black",
                        height: "40px",
                    }}
                >
                    공유된 다이어리
                </button>

                <button
                    className="deleteButton"
                    onClick={handleDeleteSelected}
                    style={{ marginBottom: "20px" }}
                >
                    삭제
                </button>

                {/* 공유 취소 버튼 또는 공유 다이어리 버튼 */}
                {isShared ? (
                    <button
                        className="unshareButton"
                        onClick={handleShareCancelSelected}
                        style={{ marginBottom: "20px" }}
                    >
                        공유 취소
                    </button>
                ) : (
                    <button
                        className="shareButton"
                        onClick={handleShareSelected}
                        style={{ marginBottom: "20px" }}
                    >
                        공유
                    </button>
                )}


            </div>
            <div className="shelfContainer" style={{ paddingTop: "30px" }}>
                <div className="shelf">
                    <div className="shelfGrid">
                        <Link to="/traveler/mydiary/diaryupload" className="addDiaryLink">
                            <div className="shelfItem addDiary">+</div>
                        </Link>

                        {allPosts.map((diary) => (
                            <div
                                key={diary.num}
                                className="shelfItem"
                                onMouseEnter={() => diary.num}
                                onMouseLeave={() => null}
                            >
                                <Link to={`/traveler/mydiary/${diary.num}`}>
                                    <div className="bookCover">
                                        <img
                                            src={`.${diary.thumbnail}`}
                                            alt={diary.title}
                                            className="shelfImage"
                                        />
                                        {diary.num && (
                                            <div className="bookTitle">{diary.title}</div>
                                        )}
                                    </div>
                                </Link>

                                <div className="checkboxWrapper">
                                    <input
                                        type="checkbox"
                                        checked={selectedDiaries.includes(diary.num)}
                                        onChange={() => handleSelectDiary(diary.num)}
                                        className="diaryCheckbox"
                                    />
                                </div>
                                
                            </div>
                            
                        ))}
                    </div>
                    <div className="woodenShelf"></div>
                        {/* 페이징 */}
                        {totalPages > 0 && (
                            <Pagenation
                                page={page}
                                totalPages={totalPages}
                                pageChange={handlePageChange}
                            />
                        )}
                </div>
                
            </div>
        </div>
    );
};

export default MyBookShelfRe;
