import React, { useEffect, useState } from "react";
import "./css/TourDiaryUp.css"; // 스타일 파일 임포트
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import { parseJwt } from "../../Comm/jwtUtils";
import { Pie } from "react-chartjs-2";

interface DiaryEntry {
  imagename: File | null;
  location: string;
  comment: string;
  preview: string;
  cnnResult: {
    predicted_emotion: string | null;
    emotion_probabilities: { [key: string]: number };
  } | null;
  ptitle: string;
}



const TourDiaryUpload: React.FC = () => {
  const [title, setTitle] = useState("");
  const [isBookCreated, setIsBookCreated] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      imagename: null,
      location: "",
      comment: "",
      preview: "",
      cnnResult: null,
      ptitle : "",
    },
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const navigate = useNavigate(); // useNavigate 훅 사용

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

  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEntries((prevEntries) => {
        const newEntries = [...prevEntries];
        newEntries[currentPage] = {
          ...newEntries[currentPage],
          imagename: file,
          preview: reader.result as string, // 미리보기 유지
        };
        return newEntries;
      });

      analyzeImageWithCNN(file, currentPage, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImageWithCNN = async (file: File, pageIndex: number, previewImg: string) => {
    const formData = new FormData();
    formData.append("image", file);

    setIsLoading(true); // 로딩 시작

    try {
      const response = await axios.post(
        `http://localhost:9000/api/diarycnn/cnn-analyze`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("CNN 분석 결과:", response.data);

      const { emotion_probabilities, predicted_emotion } = response.data.result;

      setEntries((prevEntries) => {
        const newEntries = [...prevEntries];
        newEntries[pageIndex] = {
          ...newEntries[pageIndex],
          cnnResult: {
            predicted_emotion,
            emotion_probabilities,
          },
          preview: previewImg, // 기존 preview 유지
        };
        return newEntries;
      });
    } catch (error) {
      console.error("CNN 분석 실패:", error);
      alert("이미지 분석에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };



  // 제목 생성 함수
  const handleGenerateTitle = async (index: number) => {
    const { comment, cnnResult } = entries[index];

    if (!cnnResult) {
      alert("이미지 분석을 완료해주시고 제목 생성을 다시 실행해주세요.");
      return;  // 함수 종료
    }

    if (!comment) {
      alert("코멘트를 입력해주시고 제목 생성을 다시 실행해주세요.");
      return;  // 함수 종료
    }

    try {
      console.log("predicted_emotion", cnnResult.predicted_emotion);
      console.log("Request Payload:", { comment, emotion: cnnResult.predicted_emotion });

      // 제목을 생성하기 위해 API 호출
      const response = await axios.post("http://localhost:9000/api/diarycnn/generate-title", {
        comment,
        emotion: cnnResult.predicted_emotion
      });

      const updatedEntries = [...entries];
      updatedEntries[index].ptitle = response.data.title; // 받아온 title을 ptitle에 설정
      setEntries(updatedEntries);

      console.log(`✅ 자동 생성된 제목 (${index}):`, response.data.title);
    } catch (error) {
      console.error("제목 생성 오류", error);
    }
  };


  const BackpackPieChart = () => {
    const emotionProbabilities = entries[currentPage]?.cnnResult?.emotion_probabilities || {};
  
    // 감정 확률 데이터를 배열로 변환
    const dataValues = [
      emotionProbabilities["당황"] || 0,
      emotionProbabilities["행복"] || 0,
      emotionProbabilities["중립"] || 0,
      emotionProbabilities["슬픔"] || 0,
      emotionProbabilities["분노"] || 0,
    ];
  
    const data = {
      labels: ["당황", "행복", "중립", "슬픔", "분노"],
      datasets: [
        {
          data: dataValues,
          backgroundColor: ["#FFB3B3", "#FFEB99", "#99CCFF", "#99FF99", "#D9A0D6"],
          hoverOffset: 4,
        },
      ],
    };
  
    return (
      <div>
        <h4>감정 태그 분석 (파이 차트)</h4>
        {dataValues.some(value => value > 0) ? <Pie data={data} /> : <p>분석 데이터 없음</p>}
      </div>
    );
  };
  

  const handleInputChange = (field: "location" | "comment", value: string) => {
    const newEntries = [...entries];
    newEntries[currentPage] = {
      ...newEntries[currentPage],
      [field]: value,
    };
    setEntries(newEntries);
  };

  const addNewPage = () => {
    setEntries([
      ...entries,
      {
        imagename: null,
        location: "",
        comment: "",
        preview: "",
        cnnResult: null,
        ptitle : "",
      },
    ]);
    setCurrentPage(entries.length);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < entries.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCreateBook = () => {
    if (title.trim() === "") {
      alert("다이어리 제목을 입력하세요.");
      return;
    }
    setIsBookCreated(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 모든 페이지에 대해 필드가 비어 있는지 확인
    const hasEmptyFields = entries.some(
      (entry) => !entry.location.trim() || !entry.comment.trim() || !entry.imagename
    );
  
    if (hasEmptyFields) {
      alert("모든 필드를 채워주세요!");
      return; // 폼 제출을 중지합니다.
    }


    // 모든 제목을 비동기적으로 생성 후 진행
    await Promise.all(entries.map((_, index) => handleGenerateTitle(index))); // 각 페이지 제목을 생성
  
    // Form data 전송
    const formData = new FormData();
    formData.append("title", title);
    formData.append("isshare", "0"); // 예시: 공유 여부 (1 = 공유)
    formData.append("ddate", new Date().toISOString().split("T")[0]); // 현재 날짜 추가
    formData.append("membernum", String(membernum)); // 예시: 멤버 번호
  
    if (selectedCover) {
      formData.append("thumbnail", selectedCover); // selectedCover는 File 객체여야 합니다.
    }
  
    entries.forEach((entry, index) => {
      formData.append(`pages[${index}].ptitle`, entry.ptitle);
      formData.append(`pages[${index}].content`, entry.comment);
      formData.append(`pages[${index}].location`, entry.location);

      formData.append(`pages[${index}].emotion`, entry.cnnResult?.predicted_emotion || '');
    
      formData.append(`pages[${index}].happy`, String(entry.cnnResult?.emotion_probabilities?.행복 ?? '0'));
      formData.append(`pages[${index}].upset`, String(entry.cnnResult?.emotion_probabilities?.분노 ?? '0'));
      formData.append(`pages[${index}].sad`, String(entry.cnnResult?.emotion_probabilities?.슬픔 ?? '0'));
      formData.append(`pages[${index}].embressed`, String(entry.cnnResult?.emotion_probabilities?.당황 ?? '0'));  // 예시로 '당황'을 사용
      formData.append(`pages[${index}].neutrality`, String(entry.cnnResult?.emotion_probabilities?.중립 ?? '0'));

     
    console.log(entry.cnnResult?.emotion_probabilities?.행복)
      if (entry.imagename) {
        formData.append(`imgnameFiles`, entry.imagename);
      }
    });
    
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/api/diary/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("다이어리 등록 성공:", response.data);
      navigate("/traveler/mydiary");
    } catch (error) {
      console.error("다이어리 등록 실패:", error);
      alert("다이어리 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };
  

  const coverOptions = [
    "/images/Diarycover.jpg",
    "/images/Diarycover2.jpg",
    "/images/Diarycover3.jpg",
    "/images/Diarycover4.jpg",
    "/images/Diarycover5.jpg",
    "/images/Diarycover6.jpg",
  ];

  const [selectedCover, setSelectedCover] = useState(coverOptions[0]);

  return (
    <div className="TourDiaryUpload" style={{ paddingTop: "150px", paddingBottom: "100px" }}>
      <div className="book-container">
        {/* 생성 여부에 따른 다이어리 제목과 표지 이미지 선택 UI */}
        {!isBookCreated ? (
          <div className="cover-container">
            <div className="title-container">
              <input
                type="text"
                placeholder="다이어리 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
              />
            </div>

            <div className="cover-options">
              {coverOptions.map((cover, index) => (
                <div
                  key={index}
                  className={`cover-item ${selectedCover === cover ? "selected" : ""}`}
                  onClick={() => setSelectedCover(cover)}
                >
                  <img src={`..${cover}`} alt={`Cover ${index + 1}`} />
                </div>
              ))}
            </div>

            <button
              className="create-book-button"
              onClick={handleCreateBook}
              disabled={title.trim() === ""} // 제목이 없으면 비활성화
            >
              생성
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
            {/* 다이어리 작성 폼 */}
            <div className="rounded-lg shadow-md p-6">
              <div className="border-b pb-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">
                    {currentPage + 1} / {entries.length} 페이지
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 0}
                      className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={goToNextPage}
                      disabled={currentPage === entries.length - 1}
                      className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

              {/* 이미지 업로드, 장소, 코멘트 입력, CNN 분석 결과 */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium mb-2">
                    이미지
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                      {entries[currentPage].preview ? (
                        <img
                          src={entries[currentPage].preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(e)}
                      />
                    </div>
                  </div>
                </div>

                {/* 장소와 코멘트 입력 필드 */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    📍 장소
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={entries[currentPage].location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="장소를 입력하세요"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-2">
                    코멘트
                  </label>
                  <textarea
                    id="comment"
                    value={entries[currentPage].comment}
                    onChange={(e) => handleInputChange("comment", e.target.value)}
                    placeholder="코멘트를 입력하세요"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {entries[currentPage].cnnResult?.predicted_emotion && (
  <div>
    <h3>감정 분석 결과</h3>
    <div className="flex items-start space-x-6 "> {/* 가로 정렬 및 여백 추가 */}
      {/* 감정 분석 결과 텍스트 */}
      <div>
        <h5>예측된 감정: <span className="font-bold text-blue-500">{entries[currentPage].cnnResult?.predicted_emotion}</span></h5>
        <ul>
          {Object.entries(entries[currentPage].cnnResult?.emotion_probabilities || {}).map(([emotion, probability]) => (
            <li key={emotion}>
              {emotion}: {(probability as number).toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>

      {/* 감정 태그 분석 (파이 차트) */}
      <div style={{marginLeft: "30px"}}>
        {entries[currentPage].cnnResult?.emotion_probabilities ? (
          (() => {
            const dataValues = Object.values(entries[currentPage].cnnResult?.emotion_probabilities || {});
            const data = {
              labels: Object.keys(entries[currentPage].cnnResult?.emotion_probabilities || {}),
              datasets: [
                {
                  data: dataValues,
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                },
              ],
            };

            const options = {
              maintainAspectRatio: false,
              responsive: true,
            };

            return dataValues.some(value => value > 0) ? (
              <div style={{ width: "240px", height: "240px" }}>
                <Pie data={data} options={options} />
              </div>
            ) : (
              <p>분석 데이터 없음</p>
            );
          })()
        ) : (
          <p>분석 데이터 없음</p>
        )}
      </div>
    </div>
  </div>
)}




            <div>
              <button type="button" onClick={() => handleGenerateTitle(currentPage)}>
                제목 생성
              </button>
              <p>제목 : {entries[currentPage].ptitle || "제목이 생성되지 않았습니다."}</p>
            </div>


              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={addNewPage}
                className="p-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600"
              >
                페이지 추가
              </button>
              <button
                type="submit"
                
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "제출 중..." : "제출"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TourDiaryUpload;