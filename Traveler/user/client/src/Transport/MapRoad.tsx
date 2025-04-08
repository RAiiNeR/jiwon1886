import { useEffect, useState } from "react";
import '../css/maproad.css';
import axios from "axios";
// import { geocoding } from "../navermaps";
import { Link, useNavigate } from "react-router-dom";

const MapRoad = () => {
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [routeDetails, setRouteDetails] = useState<any[]>([]); // 경로 단계 정보를 담을 상태 추가
  const navigate = useNavigate();

  // 이전 검색 기록 로드
  useEffect(() => {
    const lastSearch = JSON.parse(localStorage.getItem("lastSearch") || "{}");
    if (lastSearch.start && lastSearch.end) {
      setStartPoint(lastSearch.start);
      setEndPoint(lastSearch.end);
    }
  }, []);


  // 주소를 위도, 경도로 변환하는 함수
  const getCoordinates = async (address: string) => {
    console.log(process.env.REACT_APP_NAVER_CLIENT_ID);
    console.log(process.env.REACT_APP_NAVER_CLIENT_SECRET);

    try {
      //https://naveropenapi.apis.naver.com/map/geocode/v2/geocode?query=%EC%84%9C%EC%9A%B8%EC%97%AD


      const response = await axios.get("/naver-api/map-geocode/v2/geocode", {
        params: { query: address },
        headers: {
          'x-ncp-apigw-api-key-id': process.env.REACT_APP_NAVER_CLIENT_ID,
          'x-ncp-apigw-api-key': process.env.REACT_APP_NAVER_CLIENT_SECRET,
          'Accept': 'application/json',
        },
      });
      console.log(response.data)
      const data = await response.data;

      if (data && data.addresses && data.addresses.length > 0) {
        const { y: lat, x: lng } = data.addresses[0]; // 좌표 추출
        return { lat, lng }; // 좌표 반환
      } else {
        throw new Error("주소를 찾을 수 없습니다.");
      }
    } catch (error: any) {
      throw new Error(`Geocoding API 호출 실패: ${error.message}`);
    }
  };

  const findRoute = async () => {
    if (!startPoint || !endPoint) {
      alert("출발지와 도착지를 입력해주세요.");
      return;
    }

    try {
      // 출발지와 도착지 주소를 좌표로 변환
      const startCoords = await getCoordinates(startPoint);
      const endCoords = await getCoordinates(endPoint);

      // 경로 요청 URL을 좌표로 수정하여 경로 요청
      const response = await fetch(
        `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${startCoords.lat},${startCoords.lng}&goal=${endCoords.lat},${endCoords.lng}`,
        {
          headers: {
            "x-ncp-apigw-api-key-id": process.env.REACT_APP_NAVER_CLIENT_ID!,
            "x-ncp-apigw-api-key": process.env.REACT_APP_NAVER_CLIENT_SECRET!,
          },
        }
      );

      if (!response.ok) throw new Error("API 요청 실패");

      const data = await response.json();
      console.log(data);  // 응답 데이터 확인

      if (data?.route?.traoptimal) {
        const route = data.route.traoptimal[0];
        setDistance(route.summary.distance);
        alert(`총 거리: ${route.summary.distance}m`);
        // 경로 단계별로 정보 표시
        const steps = route.traoptimal[0].steps; // 단계별 정보
        steps.forEach((step: any) => {
          console.log(`단계: ${step.instruction}, 거리: ${step.distance}m`);
        });

        // 경로 단계들을 UI에 표시할 수 있도록 상태 업데이트
        setRouteDetails(steps);
      } else {
        alert("길찾기 실패: 응답에 경로 정보 없음");
      }
    } catch (error: any) {
      alert(`에러 발생: ${error.message}`);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_CLIENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),
        zoom: 10,
      });
    };
  }, []);

  return (
    <div>
      <div className="hero-wrap js-halfheight" style={{ backgroundImage: "url('./images/hotels/hotelbackground2.jpg')" }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-halfheight align-items-center justify-content-center" data-scrollax-parent="true">
            <div className="col-md-9 ftco-animate text-center" data-scrollax='{"properties": {"translateY": "70%"}}'>
              <p className="breadcrumbs" data-scrollax='{"properties": {"translateY": "30%", "opacity": 1.6}}'>
                <span className="mr-2"><Link to="/traveler/home">경로 추천</Link></span>
                <span>Hotel</span>
              </p>
              <h1 className="mb-3 bread" data-scrollax='{"properties": {"translateY": "30%", "opacity": 1.6}}'>숙박</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="MR-container">
        <h1 className="MR-heading">최단 경로 찾기</h1>
        <div className="MR-input-area">
          <input
            type="text"
            placeholder="출발지"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
          />
          <input
            type="text"
            placeholder="도착지"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
          />
          <button onClick={findRoute}>길찾기</button>
        </div>
        <div id="map" className="MR-result-map">
          {distance && <p>총 거리: {distance}m</p>}
          {routeDetails && routeDetails.length > 0 && (
            <div>
              <h3>경로 단계:</h3>
              <ul>
                {routeDetails.map((step: any, index: number) => (
                  <li key={index}>
                    <p>{step.instruction}</p>
                    <p>거리: {step.distance}m</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button className="MR-back-button" onClick={() => navigate(-1)}>이전 페이지로</button>
        <div className="MR-search-area">
          <h3>이전 검색 결과</h3>
          <p>출발지: {startPoint || "없음"}</p>
          <p>목적지: {endPoint || "없음"}</p>
        </div>
      </div>
    </div>
  );
};

export default MapRoad;
