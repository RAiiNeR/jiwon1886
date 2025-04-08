import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//전 객체에 kakao api 
declare global {
  interface Window {
    kakao: any;
  }
}
//지도에서 사용할 데이터 
interface Data {
  placeaddr: string;
  placename: string;
  latitude: number;
  longitude: number;
}
//props 인터페이스 : 부모 컴포넌트에서 넘겨받는 함수들
interface Mapdata {
  onChange: (data: Data) => void;//선택된 장소 데이터를 부모로 전달
  onClose: () => void;//지도 창 닫기 이벤트 
}
//지도 표시 및 검색
const MapForm: React.FC<Mapdata> = ({ onChange, onClose }) => {
  const [placeaddr, setPlaceAddr] = useState('');  // 주소 입력
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);// Kakao API 로딩 상태
  const [placeList, setPlaceList] = useState<any[]>([]);// 검색 결과 리스트 상태
  const mapRef = useRef<HTMLDivElement>(null);// 지도 렌더링할 div 참조

  // 선택된 장소 데이터를 부모 컴포넌트로 전달
  const fetchPlace = (place: any) => {
    onChange(place);
  }
  // 특정 장소 선택 처리
  const handleSelectPlace = (place: any) => {
    // console.log(place);
    const placeData = {
      placeaddr: place.address_name,
      placename: place.place_name,
      latitude: place.y,
      longitude: place.x
    }
    fetchPlace(placeData);
  }

  // 카카오맵 초기화 함수
  const initializeMap = (position: any, lat?: number, lng?: number) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng) {
      console.error("카카오맵 API가 올바르게 로드되지 않았습니다.");
      return;
    }
    if (position && !lat) {
      lat = position[0].y;
      lng = position[0].x;
    }
    const latLng = new window.kakao.maps.LatLng(lat, lng);

    const mapContainer = mapRef.current;
    if (mapContainer) {
      const mapOption = {
        center: latLng,
        level: 3,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      // 마커(지도에 위치를 나타내기 위한 시각적 요소) 추가
      for (let i = 0; i < position.length; i++) {
        const xy = new window.kakao.maps.LatLng(position[i].y, position[i].x);
        const marker = new window.kakao.maps.Marker({
          position: xy,
        });
        marker.setMap(map);
      }
    }
  };

  // 카카오맵 API 스크립트 로드 함수
  // const loadKakaoMapScript = () => {
  //   if (window.kakao) {
  //     console.log("Kakao map already loaded.");
  //     setIsKakaoLoaded(true);
  //     return;
  //   }

  //   const script = document.createElement("script");
  //   script.onload = () => {
  //     console.log("Kakao map script loaded.");
  //     setIsKakaoLoaded(true);
  //   };
  //   script.onerror = () => {
  //     console.error("Kakao map script load failed.");
  //   };
  //   console.log("여까진 왔다  ")
  //   document.head.appendChild(script);
  // };

  // 주소를 위도, 경도로 변환하는 함수
  const geocodeAddress = (address: string) => {
    if (!address.trim()) {
      alert('주소를 입력해주세요!');
      return;
    }

    // 카카오맵 API가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error('카카오맵 API 또는 services 라이브러리가 로드되지 않았습니다.');
      // loadKakaoMapScript();  // 로드 함수 호출
      return;
    }


    // 키워드로 검색 - 추가
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(address, placesSearchCB);

  };

  const placesSearchCB = (data: any, status: any, pagination: any) => {
    if (status === window.kakao.maps.services.Status.OK) {
      // 정상적으로 검색이 완료됐으면
      // 검색 목록과 마커를 표출합니다
      //console.log(data);
      initializeMap(data);
      setPlaceList(data);


    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {

      alert('검색 결과가 존재하지 않습니다.');
      return;

    } else if (status === window.kakao.maps.services.Status.ERROR) {

      alert('검색 결과 중 오류가 발생했습니다.');
      return;

    }
  }

  useEffect(() => {
    if (isKakaoLoaded) {
      // 초기 지도 로딩, 기본값 설정
      const lat = 37.5665;  // 서울 위도
      const lng = 126.978;  // 경도
      initializeMap('', lat, lng);
    }
  }, [isKakaoLoaded]);

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <div>
          <label htmlFor="placeaddr">주소</label>
          <input
            type="text"
            name="placeaddr"
            id="placeaddr"
            value={placeaddr}
            onChange={(e) => setPlaceAddr(e.target.value)}
            required
          />
        </div>
        <button type="button" className='btn btn-info' onClick={() => geocodeAddress(placeaddr)}>
          주소로 위치 찾기
        </button>
      </div>

      {/* 카카오맵 지도를 표시할 div */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '300px',
          marginTop: '20px',
        }}
      ></div>
      {
        placeList.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>장소명</th>
                <th>주소</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              {
                placeList.map((place, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{place.place_name}</td>
                    <td>{place.road_address_name}</td>
                    <td><button type='button' onClick={_ => handleSelectPlace(place)}>저장</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )
      }
    </div>
  );
};


export default MapForm;
