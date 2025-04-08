import { useEffect, useState } from "react";
import "./css/MapRoad.css"; // CSS 파일 불러오기
import { Link } from "react-router-dom";

declare global {
  interface Window {
    kakao: any;
  }
}

const MapRoad: React.FC = () => {
  const [map, setMap] = useState<any>(); // 지도 상태
  const [fixedMarker, setFixedMarker] = useState<any>(); // 고정된 마커 상태
  const [infoWindow, setInfoWindow] = useState<any>(); // 인포윈도우 상태
  const [isOpen, setIsOpen] = useState(false); // 인포윈도우 열림/닫힘 상태 추적

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById("map");
      const centerPosition = new window.kakao.maps.LatLng(37.501283, 127.025139); // 서울시 서초구

      const options = {
        center: centerPosition,
        level: 2,
      };

      const mapInstance = new window.kakao.maps.Map(container, options); // 맵 인스턴스 생성
      setMap(mapInstance); // 상태에 map 설정
      // mapInstance.setDraggable(false);
      mapInstance.setZoomable(false);
      // 고정된 위치에 마커 추가
      const marker = new window.kakao.maps.Marker({
        position: centerPosition,
        map: mapInstance,
      });
      setFixedMarker(marker);

      // 인포윈도우 생성 (중앙 정렬과 스타일링 수정)
      const content = `
        <div class="MRcustom-info-window" style="text-align: center;">
          <a href="https://map.kakao.com/?from=roughmap&eName=%EC%84%9C%EC%9A%B8%20%EC%84%9C%EC%B4%88%EA%B5%AC%20%EC%84%9C%EC%B4%88%EB%8C%80%EB%A1%9C77%EA%B8%B8%2041" target="_blank">
            <span class="MRtitle">누리군청</span>
          </a>
        </div>`;
      const infowindow = new window.kakao.maps.InfoWindow({
        content: content,
        position: centerPosition,
      });
      setInfoWindow(infowindow);

      // 마커 클릭 시 인포윈도우 열기
      window.kakao.maps.event.addListener(marker, "click", function () {
        if (!isOpen) {
          infowindow.open(mapInstance, marker);
          setIsOpen(true);
        }
      });
    } else {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY&libraries=services,clusterer&autoload=true`;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          const container = document.getElementById("map");
          const options = {
            center: new window.kakao.maps.LatLng(37.501283, 127.025139),
            level: 10,
          };
          const mapInstance = new window.kakao.maps.Map(container, options);
          setMap(mapInstance);
        }
      };
    }
  }, []);

  // 현재 위치 함수 (군청 위치로 이동)
  const moveToFixedMarker = () => {
    if (fixedMarker && map) {
      const fixedPosition = fixedMarker.getPosition(); // 고정된 마커의 위치 가져오기
      map.panTo(fixedPosition); // 지도 중심을 고정된 마커 위치로 이동
    }
  };

  return (
    <div className="map-road-container">
      {/* 제목 */}
      <h1 className="MRheading">오시는 길</h1>

      {/* 지도 영역 */}
      <div id="map" className="map-container"></div>

      <div className="MRbuttons">
        <Link
          className="MRbutton"
          target="_blank"
          to="https://map.kakao.com/?from=roughmap&eName=%EC%84%9C%EC%9A%B8%20%EC%84%9C%EC%B4%88%EA%B5%AC%20%EC%84%9C%EC%B4%88%EB%8C%80%EB%A1%9C77%EA%B8%B8%2041"
        >
          길찾기
        </Link>

        <Link
          className="MRbutton"
          to="#"
          onClick={(e) => {
            e.preventDefault();
            moveToFixedMarker(); // 군청 위치로 이동하는 함수 호출
          }}
        >
          군청 위치로
        </Link>
      </div>

      {/* 주소 및 연락처 */}
      <p className="MRinfo">
        <span>
          <img
            src="images/kakaomap/MapMarker.png"
            width="42"
            height="34"
            alt="지도 마커"
          />
          <h3>서울시 서초구 서초대로 77길 4층 (누리군청)</h3>
        </span>

        <span>
          <span>
            <img src="images/kakaomap/Tel.png" width="32" height="24" alt="전화" />
            <span>
              <b>TEL</b>
              <br />
              02-1234-1234
            </span>
          </span>

          <span>
            <img src="images/kakaomap/Fax.png" width="32" height="24" alt="팩스" />
            <span>
              <b>FAX</b>
              <br />
              02-1234-1234
            </span>
          </span>
        </span>
      </p>

      {/* 교통편 */}
      <div className="MRtransport-title">교통편</div>
      <div className="MRtransport">
        <span className="MRtransport-item">
          <img src="images/kakaomap/Bus.png" width="32" height="24" alt="버스" />
          <span>
            <b>버스</b>
            <br />
            140,421,441,452,470,741
          </span>
        </span>

        <span className="MRtransport-item">
          <img src="images/kakaomap/Train.png" width="32" height="24" alt="지하철" />
          <span>
            <b>지하철</b>
            <br />
            신논현역 8번출구 300m 3분거리, 강남역 10번출구 400m 5분거리
          </span>
        </span>
      </div>
    </div>
  );
};

export default MapRoad;
