import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Promote.css';
import axios from 'axios';
import { text } from 'stream/consumers';

interface Promote {
    num: number;
    title: string;
    img_names: string[];
    hit: number;
    pdate: string;
}

const PromoteList: React.FC = () => {
    const [allPosts, setAllPosts] = useState<Promote[]>([]); // 전체 게시글
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [title, setTitle] = useState(''); // 제목 검색
    const [check, setCheck] = useState(false) // 검색 버튼 동작 감지
    const navigate = useNavigate();

    const itemsPerPage = 9; // 페이지당 항목 수
    const pagePerBlock = 5; // 한 블럭에 표시할 페이지 수

    const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`; // 이미지 파일 경로

    // 데이터를 서버에서 받아오는 함수
    const getPromoteList = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/promote`, {
                params: {
                    page: currentPage, // 오청할 페이지 번호
                    size: itemsPerPage, // 한 페이지당 항목 수 
                    title: title, // 검색할 제목
                },
            });
            setAllPosts(response.data.content); // 전체 게시글
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.log('Error Message: ' + error);
        }
    };

    useEffect(() => {
        getPromoteList();
    }, [currentPage, check]); // currentPage 또는 title이 변경될 때마다 getPromoteList 호출

    // 페이지 블록 계산
    useEffect(() => {
        setStartPage((Math.floor((currentPage - 1) / pagePerBlock) * pagePerBlock) + 1); // 시작페이지 계산
        let end = (Math.floor((currentPage - 1) / pagePerBlock) + 1) * pagePerBlock; // 끝페이지 계산
        end = end > totalPages ? totalPages : end; // 끝 페이지가 전체 페이지를 초과하지 않도록 조정
        setEndPage(end);
    }, [allPosts])

    // 타이틀 클릭 시 해당 상세 페이지로 이동
    const handleTitleClick = (num: number) => {
        navigate(`/promote/${num}`);
    };

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // 검색 
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value); // 검색어 입력 시 상태 업데이트
    };

    // 검색 버튼 클릭 시 필터링된 게시글 업데이트
    const handleSearchClick = () => {
        setCheck(!check);
    };

    const [translation, setTranslation] = useState<string[]>([]); // 번역된 텍스트
    const [onoff, setOnoff] = useState(0); // 번역 여부
    const [targetLanguage, setTargetLanguage] = useState(""); // 번역 대상 언어

    useEffect(() => {
        console.log(targetLanguage);
        const translate = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/translate`, {
                    text: [
                        "행사안내",//0
                        "조회수",//1
                        "등록일",//2
                        "검색어를 입력하세요",//3
                        "검색",//4
                        "이전",//5
                        "다음"//6
                    ], // 텍스트를 배열로
                    target_lang: targetLanguage, // 번역할 언어 설정
                });
                // 번역된 텍스트를 상태에 저장
                const translatedTexts = response.data.translations.map((item: { text: string }) => item.text);
                // 번역된 텍스트를 상태로 업데이트 
                setTranslation(translatedTexts); // 번역된 텍스트 상태 업데이트

                // onoff 상태를 변경하여 번역/원본 텍스트 전환
                setOnoff(1); //토글s
                //setTargetLanguage("");
            } catch (error) {
                console.error("Error during translation:", error);
                // setTranslation("Translation failed."); // 오류 발생 시 메시지 설정
            }
        }
        translate()
    }, [targetLanguage])

    // 번역 함수
    const handleTranslate = () => {

        //언어설정
        const languageMap: Record<string, string> = {
            "1": "KO", // 한국어
            "2": "EN", // 영어
            "3": "ZH", // 중국어
            "4": "JA", // 일본어
            "5": "ES", // 스페인어
        };
        const selectedLanguage = languageMap[LanguageType] || "KO"; // LanguageType이 languageMap에 없는 경우 기본값으로 KO(한국어)
        setTargetLanguage(selectedLanguage);
    };

    const [transTitles, setTransTitles] = useState<string[]>([]); // 각 타이틀에 대한 번역 저장

    useEffect(() => {
        const translateTitles = async () => {
            const translatedTitles = await Promise.all( // 비동기식 번역 API
                allPosts.map(async (item, index) => {
                    try {
                        const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/translate`, {
                            text: [item.title], // 게시글 제목 번역
                            target_lang: targetLanguage,
                        });
                        return response.data.translations[0].text;
                    } catch (error) {
                        console.error(`번역 오류 (index ${index}):`, error);
                        return item.title; // 오류 시 원본 제목 반환
                    }
                })
            );
            setTransTitles(translatedTitles); // 반환된 번역된 제목 배열을 setTransTitles
        };

        if (allPosts.length > 0 && targetLanguage) {
            translateTitles();
        }
    }, [targetLanguage, allPosts]);


    const [LanguageType, setLanguageType] = useState('1'); // 기본 언어(한국어)

    return (
        <div className="promoteHomeContainer">
            <main className="container">
                <h2>{onoff === 0 ? "행사안내" : `${translation[0]}`}</h2>
                {/* 번역 */}
                <div className="translation">
                    <select onChange={(e) => setLanguageType(e.target.value)}>
                        <option value="1">한국어(KOREAN)</option>
                        <option value="2">영어(ENGLISH)</option>
                        <option value="3">중국어(CHINESE)</option>
                        <option value="4">일본어(JAPANESE)</option>
                        <option value="5">스페인어(SPANISH)</option>
                    </select>
                    <button onClick={handleTranslate} >번역(Translate)</button>
                </div>
                <ul className="product-list">
                    {allPosts.map((item, index) => (
                        <li key={index} className="product-item" onClick={() => handleTitleClick(item.num)}>
                            <img src={filePath + item.img_names[0]} alt={item.title} className="product-image" />
                            <div className="caption">
                                <h3 className="product-title">
                                    {onoff === 0 ? item.title : transTitles[index] || item.title}
                                </h3>
                                <div className="info-row">
                                    <p className="product-hit">
                                        {onoff === 0 ? `조회수: ${item.hit}` : `${translation[1]}:${item.hit}`}</p>
                                    <p className="product-date">
                                        {onoff === 0 ? `등록일: ${item.pdate.slice(0, 10)}` : `${translation[2]}:${item.pdate.slice(0, 10)}`}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="search-box">
                    {/* 검색어 입력 */}
                    <div className="search-container">
                        <input
                            type="text"
                            className="form-search"
                            placeholder={onoff === 0 ? "검색어를 입력하세요..." : translation[3]}
                            value={title}
                            onChange={handleSearchChange} // 검색어 입력 시 상태 업데이트
                        />
                        <button className="btn btn-primary" onClick={handleSearchClick}>
                            {onoff === 0 ? "검색" : `${translation[4]}`}
                        </button>
                    </div>
                </div>

                {/* 페이징 */}
                <div className="d-flex justify-content-center mt-4">
                    <nav>
                        <ul className="pagination">
                            {/* 이전 페이지 출력 */}
                            {startPage > 1 && (
                                <li className="page-item">
                                    <button className="page-link" onClick={() => handlePageChange(startPage - 1)}>
                                        {onoff === 0 ? "이전" : `${translation[5]}`}
                                    </button>
                                </li>
                            )}

                            {/* 페이지 번호 출력 */}
                            {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((page) => (
                                <li key={page} className={`page-item ${page=== currentPage ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page)}>
                                        {page}
                                    </button>
                                </li>
                            ))}

                            {/* 다음 페이지 출력 */}
                            {endPage < totalPages && (
                                <li className="page-item">
                                    <button className="page-link" onClick={() => handlePageChange(endPage + 1)}>
                                        {onoff === 0 ? "다음" : `${translation[6]}`}
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </main>
        </div>
    );
};

export default PromoteList;