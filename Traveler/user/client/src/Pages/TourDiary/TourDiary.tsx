import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./css/TourDiary.css"; // 스타일 추가
import HTMLFlipBook from "react-pageflip";

interface DiaryPage {
  num: number;
  page: number;
  ptitle: string;
  imgname: string;
  content: string;
  location: string;
  happy: number | null;
  upset: number | null;
  embressed: number | null;
  sad: number | null;
  neutrality: number | null;
  emotion: string | null;
}

interface Diary {
  num: number;
  title: string;
  thumbnail: string;
  isshare: number;
  hit: number;
  heart: number;
  ddate: string;
  membernum : number;
  diary_page: DiaryPage[];
}

const PageCover = React.forwardRef<HTMLDivElement, PageCoverProps>((props, ref) => {
  return (
    <div className="cover" ref={ref} data-density="hard">
      <div>
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

const FirstPageCover = React.forwardRef<HTMLDivElement, PageCoverProps & { thumbnail?: string }>((props, ref) => {

  const thumbnailUrl = props.thumbnail
  ? `.${props.thumbnail}`
  : `${process.env.PUBLIC_URL}/images/Diarycover3_2.jpg`; // 기본 이미지 경로

return (
  <div className="firstcover" ref={ref} data-density="hard">
    <div>
      <h2>{props.children}</h2>
    </div>
    <img
      src={`.${thumbnailUrl}`}
      alt="First Page Cover"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '10px',
      }}
    />
  </div>
);
});


const LastPageCover = React.forwardRef<HTMLDivElement, PageCoverProps>((props, ref) => {
  return (
    <div className="lastcover" ref={ref} data-density="hard">
      <div>
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

interface PageProps {
  children: React.ReactNode;
  ptitle: string;
}

interface PageCoverProps {
  children?: React.ReactNode;  // children을 옵셔널로 설정
}

const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <h3>{props.ptitle}</h3> {/* ptitle을 화면에 표시 */}
      <div className="content">{props.children}</div>
    </div>
  );
});


const TourDiaryDetail: React.FC = () => {
  const [diary, setDiary] = useState<Diary | null>(null);
  const { num } = useParams<{ num: string }>();
  console.log("num값"+num); // num 값 확인

  // 디테일 페이지 데이터를 불러오는 함수
  useEffect(() => {
    const fetchDiaryDetail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/diary/detail/${num}`);
        console.log(response.data); // 데이터 구조 확인
        if (response.data && response.data.diary_page) {
          setDiary(response.data);
        } else {
          console.error("Diary data structure is unexpected:", response.data);
        }
      } catch (error) {
        console.log("Error fetching diary detail:", error);
      }
    };
  
    fetchDiaryDetail();
  }, [num]);
  // num이 변경될 때마다 새로 호출

  if (!diary) {
    return <div>Loading...</div>; // 데이터가 없으면 로딩 표시
  }


const pages = diary.diary_page.map((page) => ({
  number: page.page.toString(),
  imgname: page.imgname,
  comment: page.content,
  address: page.location,
  ptitle : page.ptitle,
  emotion : page.emotion,
}));

// 페이지 수가 홀수일 경우 마지막에 빈 페이지 추가
const adjustedPages = pages.length % 2 !== 0
  ? [...pages, { number: (pages.length + 1).toString(), imgname: "", comment: "", address: "",ptitle: "" ,emotion:""}]
  : pages;


return (
    <div className={`book`}>
      {/* 'box' div로 감싸기 */}
      <div className="box" style={{marginTop: "120px", marginBottom: "100px"}}>
        <div className="bookinfo" >
          <HTMLFlipBook
            width={450}
            height={550}
            minWidth={300}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
            maxWidth={1200}
            minHeight={400}
            maxHeight={1200}
            showCover={true}
            flippingTime={1000}
            style={{ margin: "0 auto" }}
            maxShadowOpacity={0.5}
            className="album-web"
            startPage={0}
            size="stretch"
            drawShadow={true}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            mobileScrollSupport={false}
            clickEventForward={false}
            useMouseEvents={true}
            swipeDistance={50}
            showPageCorners={true}
            disableFlipByClick={false}
          >
             <FirstPageCover thumbnail={diary.thumbnail}></FirstPageCover>
            <PageCover></PageCover>
            {adjustedPages.map((page) => (
               <Page  key={page.number} ptitle={page.ptitle}>
                <div>
                  {page.imgname ? (
                    console.log(`${diary.thumbnail}`),
                    <img
                      src={`${process.env.REACT_APP_FILES_URL}/img/diary/${page.imgname}`}
                      alt={`Page ${page.number}`}
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "80%",
                        maxHeight:"300px",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: "center", padding: "50px" }}>
                    </div>
                  )}
                 {page.address && <p style={{ marginTop: "5px" }}>📍 {page.address}</p>}
                  <h4 style={{ marginTop: "15px" }}>{page.comment}</h4>
                  {page.emotion && <h4 style={{ marginTop: "15px" }}> 감정 : {page.emotion}</h4>}
                </div>
              </Page>
            ))}
            <PageCover></PageCover>
            <LastPageCover></LastPageCover>
          </HTMLFlipBook>
        </div>
      </div>


  </div>
  );
};

export default TourDiaryDetail;
