import React from "react";
import "../../css/search.css"; // CSS 파일 임포트

const SearchBar: React.FC = () => {
    return (
        <div className="home-search-bar">
            {/* 검색어 입력 */}
            <input type="text" className="search-field" placeholder="여행지나 숙소를 검색해보세요." />

            {/* 지역 선택 */}
            <select className="location-select">
                <option value="">지역 선택</option>
                <option value="seoul">서울</option>
                <option value="busan">부산</option>
                <option value="jeju">제주</option>
                <option value="gangwon">강원</option>
                <option value="incheon">인천</option>
            </select>

            {/* 검색 버튼 */}
            <button className="search-btn" style={{ marginTop: '3px' }}>🔍 검색</button>
        </div>


    );
};

export default SearchBar;
