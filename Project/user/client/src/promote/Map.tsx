import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface MapVO {
  placeaddr: string; // 장소 주소
  placename: string; // 장소 이름
  latitude: number; // 위도
  longitude: number; // 경도
}

// 카카오맵 API 선언
declare global {
    interface Window {
      kakao: any;
    }
  }

const Map: React.FC<{map:MapVO}> = ({map}) => {
  const mapRef = useRef<HTMLDivElement>(null); // 지도를 표시할 HTML 요소를 참조하기 위한 useRef
  

  // 카카오맵 API 로드 후 지도 표시
  const displayMap = (lat: number, lng: number) => {
    // 카카오맵 API가 올바르게 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng) {
        console.error("카카오맵 API가 올바르게 로드되지 않았습니다.");
        return;
      }

    const latLng = new window.kakao.maps.LatLng(lat, lng);
    const container = mapRef.current; // 지도를 표시할 div
    if (container) {
      const options = {
        center: latLng, // 중심 좌표
        level: 2, // 지도 확대
      };

      // 지도 생성
      const kakaoMap = new window.kakao.maps.Map(container, options);

      // 마커 표시
      // const markerPosition = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({
        position: latLng, // 마커 위치
      });
      marker.setMap(kakaoMap);
      kakaoMap.setDraggable(false);  // 드래그 기능 비활성화
      kakaoMap.setZoomable(false);  // 확대/축소 기능 비활성화
    } else {
      console.error('카카오맵 API가 로드되지 않았습니다.');
    }
    }

  useEffect(() => {
    if (map && map.latitude && map.longitude) {
      // map 데이터가 로드되면 지도 표시
      displayMap(map.latitude, map.longitude);
    }
  }, [map]);


  if (!map) {
    return <div>로딩 중....</div>;
  }

  return (
<div style={{ display: 'flex', justifyContent: 'start'}}> 
  <div
    ref={mapRef}
    style={{
      width: '300px', // 가로
      height: '300px', // 세로
    }}
  ></div>

  <div style={{ width: '45%', paddingLeft: '20px'}}>
    <h3>{map.placename}</h3>
    {/* <p>번호: {mapuser.num}</p> */}
    <p>주소: {map.placeaddr}</p>
    {/* <p>장소: {mapuser.placename}</p> */}
    {/* <p>위도: {mapuser.latitude}</p> */}
    {/* <p>경도: {mapuser.longitude}</p> */}
    <div style={{ marginTop: '20px' }}>
      {/* <button type='button' onClick={handleDelete} style={{ marginLeft: '10px' }}>
        삭제
      </button> */}
    </div>
  </div>
</div>
  );
};

export default Map;
