import React, { useEffect, useRef, useState } from 'react';

interface MapVO {
    placeaddr: string;
    placename: string;
    latitude?: number;  // 위도 (옵셔널로 설정)
    longitude?: number; // 경도 (옵셔널로 설정)
}

declare global {
    interface Window {
        kakao: any;
    }
}

const Map: React.FC<{ map: MapVO }> = ({ map }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);  // 지도 div 참조
    const [latitude, setLatitude] = useState<number | undefined>(map.latitude);
    const [longitude, setLongitude] = useState<number | undefined>(map.longitude);

    // 카카오맵 API 로드 후 지도 표시
    const displayMap = (lat: number, lng: number) => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng) {
            console.error("카카오맵 API가 올바르게 로드되지 않았습니다.");
            return;
        }

        const latLng = new window.kakao.maps.LatLng(lat, lng);
        const container = mapRef.current;  // 지도 표시할 div

        if (container) {
            const options = {
                center: latLng,
                level: 3,  // 기본 줌 레벨
            };

            const kakaoMap = new window.kakao.maps.Map(container, options);

            const marker = new window.kakao.maps.Marker({
                position: latLng,
            });
            marker.setMap(kakaoMap);

            kakaoMap.setDraggable(false);
            kakaoMap.setZoomable(false);
        } else {
            console.error('지도를 표시할 div가 없습니다.');
        }
    };

    // 주소를 위도, 경도로 변환하는 함수
    const getLatLngFromAddress = (address: string) => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng) {
            console.error("카카오맵 API가 올바르게 로드되지 않았습니다.");
            return;
        }
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: any, status: string) => {
            console.log('주소 변환 결과:', result);  // 변환된 결과를 확인
            if (status === window.kakao.maps.services.Status.OK) {
                // 주소가 성공적으로 변환되었을 때
                const lat = result[0].y;  // 위도
                const lng = result[0].x;  // 경도
                setLatitude(lat);  // 상태 업데이트
                setLongitude(lng);  // 상태 업데이트
            } else {
                console.error('주소 변환에 실패했습니다.');
            }
        });
    };

    useEffect(() => {
        // map 객체가 바뀔 때마다 위도/경도 업데이트
        if (latitude && longitude) {
            displayMap(latitude, longitude);  // 위도, 경도 값이 있을 경우 지도 표시
        } else if (map.placeaddr) {
            // 주소가 있을 경우, 주소를 위도 경도로 변환하여 지도 표시
            getLatLngFromAddress(map.placeaddr);
        }
    }, [latitude, longitude, map]);  // 위도, 경도나 map 데이터가 변경될 때마다 실행

    if (!map) {
        return <div>로딩 중...</div>;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'start' }}>
            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '300px',
                }}
            ></div>

            <div style={{ width: '45%', paddingLeft: '20px' }}>
                <h3>{map.placename || "장소명 없음"}</h3>
                <p>주소: {map.placeaddr || "주소 정보 없음"}</p>
            </div>
        </div>
    );
};

export default Map;
