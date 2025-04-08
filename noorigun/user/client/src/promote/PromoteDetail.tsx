import React, { useEffect, useState } from "react"; // React 기능 및 훅 가져오기
import { Link, useNavigate } from "react-router-dom"; // 라우팅을 위한 훅 및 컴포넌트
import axios from "axios"; // HTTP 요청을 위한 Axios
import "./css/Promote.css"; // 컴포넌트 스타일링
import Map from "./Map";

// 데이터 구조 정의: API에서 받을 데이터를 형식화하기 위해 인터페이스 정의
interface PromoteDetailData {
  num: number; // 글 번호
  writer: string; // 작성자
  title: string; // 제목
  img_names: string[]; // 이미지 파일 이름 리스트
  hit: number; // 조회수
  pdate: string; // 작성 날짜
  content: string; // 글 내용
  placeaddr: string; // 장소 주소
  placename: string; // 장소 이름
  latitude: number; // 위도
  longitude: number; // 경도
}

const PromoteDetail: React.FC<{ num: string }> = ({ num }) => {
  const [detail, setDetail] = useState<PromoteDetailData | null>(null); // 현재 글 상세 정보
  const [nextTitle, setNextTitle] = useState<string | null>(null); // 다음 글 제목
  const [backTitle, setBackTitle] = useState<string | null>(null); // 이전 글 제목
  const [nextDate, setNextDate] = useState<string | null>(null); // 다음 글 날짜
  const [backDate, setBackDate] = useState<string | null>(null); // 이전 글 날짜
  const [mapData, setMapData] = useState<any>(); // 지도
  const [totalLength, setTotalLength] = useState(0); // 전체 글 개수
  const [error, setError] = useState<string>(""); // 에러 메시지

  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const currentNum = parseInt(num as string); // 현재 글 번호를 정수로 변환
  const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`; // 이미지 파일 경로

  // 현재 글 상세 데이터를 가져오는 효과
  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACK_END_URL}/api/promote/detail?num=${num}`
        ); // API 호출: 현재 글 상세 정보 가져오기
        console.log(response.data)
        setDetail(response.data); // 응답 데이터로 상태 업데이트

        const responseItem = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/promote/list`); // API 호출: 전체 글 리스트 가져오기
        setTotalLength(responseItem.data.length); // 전체 글 개수 업데이트
      } catch (err) {
        setError("데이터를 불러오는 데 실패했습니다."); // 에러 발생 시 메시지 설정
      }
    };
    getDetail();
  }, [num]); // 글 번호 변경 시 실행

  // 지도 
  useEffect(() => {
    setMapData({
        // detail이 null 또는 undefined일 경우 에러를 방지(detail이 값이 없으면 undefined를 반환)
        placeaddr: detail?.placeaddr, // 장소 주소
        placename: detail?.placename, // 장소 이름
        latitude: detail?.latitude, // 위도
        longitude: detail?.longitude, // 경도
    })
}, [detail])

  // 다음 글 데이터를 가져오는 효과
  useEffect(() => {
    const getNextPage = async () => {
      try {
        if (currentNum < totalLength) { // 다음 글이 있는지 확인
          const responseNext = await axios.get(
            `${process.env.REACT_APP_BACK_END_URL}/api/promote/detail?num=${currentNum + 1}`
          );
          setNextTitle(responseNext.data.title); // 다음 글 제목 업데이트
          setNextDate(responseNext.data.pdate); // 다음 글 날짜 업데이트
        }
      } catch (err) {
        console.log("Error Message: " + err); // 에러 로그 출력
      }
    };
    getNextPage();
  }, [currentNum, totalLength]); // 현재 글 번호 또는 전체 글 개수 변경 시 실행

  // 이전 글 데이터를 가져오는 효과
  useEffect(() => {
    const getBackPage = async () => {
      try {
        if (currentNum > 1) { // 이전 글이 있는지 확인
          const responseBefore = await axios.get(
            `${process.env.REACT_APP_BACK_END_URL}/api/promote/detail?num=${currentNum - 1}`
          );
          setBackTitle(responseBefore.data.title); // 이전 글 제목 업데이트
          setBackDate(responseBefore.data.pdate); // 이전 글 날짜 업데이트
        }
      } catch (err) {
        console.log("Error Message: " + err); // 에러 로그 출력
      }
    };
    getBackPage();
  }, [currentNum]); // 현재 글 번호 변경 시 실행

  // 이미지 다운로드 기능 구현
  const handleImageDownload = (filePath: string) => {
    const fileName = filePath.split("/").pop() || "download"; // 파일 이름 추출
    const link = document.createElement("a"); // 다운로드용 링크 생성
    link.href = filePath;
    link.setAttribute("download", fileName); // 다운로드 속성 설정
    document.body.appendChild(link); // DOM에 링크 추가
    link.click(); // 링크 클릭으로 다운로드 실행
    document.body.removeChild(link); // 링크 제거
  };

  // 메인 페이지로 이동
  const MainPage = () => {
    navigate("/noorigun/promote"); // "/" 경로로 이동
  };

  const [translation, setTranslation] = useState<string[]>([]);
  const [onoff, setOnoff] = useState(0); // 번역 여부
  const [targetLanguage, setTargetLanguage] = useState("");
  const [LanguageType, setLanguageType] = useState('1'); // 기본 언어(한국어)

  useEffect(() => {
    console.log(targetLanguage);
    const translate = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/translate`, {
          text: [detail?.title,//0
          detail?.content,//1
          detail?.writer,//2
          nextTitle || "",//3
          backTitle || "",//4
            "작성자",//5
            "조회수",//6
            "첨부파일",//7
            "다운",//8
            "이전페이지",//9
            "다음페이지"//10
          ], // 텍스트를 배열로
          target_lang: targetLanguage, // 번역할 언어 설정
        });
        // 번역된 텍스트를 상태에 저장
        const translatedTexts = response.data.translations.map((item: { text: string }) => item.text);
        // 번역된 텍스트를 상태로 업데이트 
        setTranslation(translatedTexts); // 번역된 텍스트 상태 업데이트

        // onoff 상태를 변경하여 번역/원본 텍스트 전환
        setOnoff(1); //토글
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




  return (
    <div className="PromoteDetailcontainer">
      {/* <div id="google_translate_element"></div> 번역 위젯 위치 */}

      <div className="title-section">{onoff === 0 ? detail?.title : translation[0]}</div> {/* 제목 표시 */}
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

      {detail && (
        <>
          {/* 글 정보 */}
          <div className="info-container">
            <span className="info-left">
              {onoff === 0 ? `작성자 : ${detail.writer}` : `${translation[5]} : ${translation[2]}`} </span>{/*작성자*/}
            <span className="info-right">
              {onoff === 0 ? `조회수 : ${detail.hit}` : `${translation[6]}: ${detail.hit}`}</span>{/*조회수*/}
            <span className="info-right">{detail.pdate.slice(0, 10)}</span>
          </div>

          {/* 내용 및 이미지 */}
          <div className="content-section">
            {detail.img_names.map((item, index) => (
              <div key={item + index} className="image-wrapper">
                <img
                  className="styled-image"
                  src={`${filePath}${item}`}
                  alt={detail.title}
                />
              </div>
            ))}
            <div className="content-box">
              <p>{onoff === 0 ? detail?.content : translation[1]}</p>
            </div>
          </div>
          {
            mapData && (
              <Map map={mapData} />
            )
          }

          {/* 첨부 파일 다운로드 버튼 */}
          <div className="attachment">
            <p>
              {onoff === 0 ? "첨부파일" : "File"}:{" "}
              {detail.img_names.map((item, index) => (
                <span key={index}>
                  {item}
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleImageDownload(`${filePath}${item}`)}
                  >
                    {onoff === 0 ? "다운" : translation[8]}
                  </button>
                </span>
              ))}
            </p>
          </div>

          {/* 이전글/다음글 네비게이션 */}
          <div className="navigation-section">
            {currentNum < totalLength && nextTitle && (
              <div className="nav-item">
                <p>{onoff === 0 ? "다음글:" : `${translation[10]} : `}</p>
                <Link to={`/noorigun/promote/${currentNum + 1}`}>{onoff === 0 ? nextTitle : translation[3]}</Link>
                <span>{nextDate?.slice(0, 10)}</span>
              </div>
            )}

            {currentNum > 1 && backTitle && (
              <div className="nav-item">
                <p>{onoff === 0 ? "이전글:" : `${translation[9]} : `}</p>
                <Link to={`/noorigun/promote/${currentNum - 1}`}>{onoff === 0 ? backTitle : translation[4]}</Link>
                <span>{backDate?.slice(0, 10)}</span>
              </div>
            )}
          </div>

          {/* 메인 페이지로 돌아가는 버튼 */}
          <div className="button-container">
            <button className="main-button" onClick={MainPage}>
              {onoff === 0 ? "메인 페이지로" : "MainPage"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PromoteDetail;
