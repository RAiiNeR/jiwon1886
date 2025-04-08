import React, { useEffect, useRef, useState } from 'react';

interface HotelMapProps {
    location: string;
    name: string;
}

const HotelMap: React.FC<HotelMapProps> = ({ location, name }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
    const mapContainer = mapRef.current ?? document.createElement('div');

    useEffect(() => {
        // 1. Google Maps API 스크립트 로드
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAeD1uxDcg8St8QRAF4-Q7rVAhtx_5YMD8&libraries=places`; // YOUR_API_KEY를 실제 키로 변경
            script.async = true;
            script.defer = true;
            script.onload = () => {
                setMapLoaded(true); // API 로드 완료 후 mapLoaded를 true로 설정
            };
            document.head.appendChild(script);
        }

        // 2. API 로드 후 Geocoder 생성 (mapLoaded가 true일 때)
        if (mapLoaded && !geocoder) {
            setGeocoder(new window.google.maps.Geocoder());
        }

        // 3. Geocoder 생성 후 Geocoding 및 지도 생성 (geocoder가 null이 아닐 때)
        if (mapLoaded && geocoder && mapRef.current) {  // mapRef.current 확인 추가
            geocoder.geocode({ address: location }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    const latitude = results[0].geometry.location.lat();
                    const longitude = results[0].geometry.location.lng();

                    const map = new window.google.maps.Map(mapContainer, {
                        center: { lat: latitude, lng: longitude },
                        zoom: 16,
                    });

                    new window.google.maps.Marker({
                        position: { lat: latitude, lng: longitude },
                        map: map,
                        title: name,
                    });
                } else {
                    console.error("Geocode was not successful for that address: " + status);
                    mapContainer.innerHTML = "지도 정보를 불러올 수 없습니다.";
                }
            });
        }
    }, [location, name, mapLoaded, geocoder]);

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default HotelMap;