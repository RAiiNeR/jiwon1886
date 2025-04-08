import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChartRenderer from './ChartRenderer';
import StatisticsTable from './StatisticsTable';
import BarChartRenderer from './BarChartRender';
import './css/PollStatistics.css';
import RequireAuth from '../comp/RequireAuth';

const PollStatistics = () => {
  const [statistics, setStatistics] = useState<any[]>([]);
  const [topStatistics, setTopStatistics] = useState<any[]>([]); // 상위 20개 데이터
  const [filteredStatistics, setFilteredStatistics] = useState<any[]>([]); // 검색 및 페이징용 데이터
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>(''); // 검색어
  const [searchInput, setSearchInput] = useState<string>(''); // 입력창의 검색어
  const [searchType, setSearchType] = useState<string>('poll_title'); // 검색 타입 (제목 or 옵션)
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [pageSize] = useState<number>(20); // 페이지 크기

  const endpointMap: Record<string, string> = {
    전체: '', // 기본 통계
    '종료된 투표': 'ended', // ended
    '최근 종료한 투표 (7일)': 'range', // range
    '최다 득표 항목': 'top-options', // topVotedOptions
    '진행중인 투표': 'active-options', // activeOptionCount
    '총 득표 수': 'total-votes', // totalVotes
    '조회수 비례 투표율': 'participation-rate',
    '최근 2주 핫한 투표': 'recent-hot-2weeks', 
    '오래된 투표': 'oldest-polls',
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (selectedCategory === '전체') {
      applyFilters();
    }
  }, [searchTerm, statistics]);

  const fetchStatistics = async (endpoint = '') => {
    const url = `${process.env.REACT_APP_BACK_END_URL}/api/admin/statistics${endpoint ? `/${endpoint}` : ''}`;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(url);

      const processedData = response.data.map((item: any) => ({
        ...item,
        poll_title: item.poll_title || '알 수 없음',
        option_text: item.option_text || '옵션 없음',
        vote_count: item.vote_count !== undefined ? item.vote_count : 0,
      }));

      if (endpoint === '') {
        const top20Data = [...processedData]
          .sort((a, b) => b.vote_count - a.vote_count)
          .slice(0, 20);
        setTopStatistics(top20Data);
        setStatistics(processedData);
        setFilteredStatistics(processedData);
      } else {
        setStatistics(processedData.slice(0, 20)); // 상위 20개로 제한
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('통계 데이터를 가져오는 데 실패했습니다.');
      setStatistics([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchStatistics(endpointMap[category as keyof typeof endpointMap] || '');
  };

  const applyFilters = () => {
    const filtered = statistics.filter((stat) =>
      stat[searchType].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStatistics(filtered);
    setCurrentPage(1); // 검색 시 페이지 초기화
  };

  const handleSearch = () => {
    setSearchTerm(searchInput); // 검색 버튼 클릭 시 검색어 적용
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(searchInput); // Enter 키 입력 시 검색어 적용
    }
  };

  // 페이징 처리
  const totalPages = Math.ceil(filteredStatistics.length / pageSize);
  const paginatedData = filteredStatistics.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <RequireAuth>
      <div style={{padding:'20px 50px'}}>
        <div className="poll-statistics">
          <h1>투표 통계</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="poll-statistics-category">
            {Object.keys(endpointMap).map((key) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={selectedCategory === key ? 'active' : ''}
              >
                {key}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p>데이터를 불러오는 중...</p>
          ) : (
            <>
              {selectedCategory === '전체' ? (
                <>
                  <BarChartRenderer statistics={topStatistics} />
                  {/* 검색 UI */}
                  <div className="search-container">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="poll_title">제목</option>
                      <option value="option_text">옵션</option>
                    </select>
                    <input
                      type="text"
                      placeholder="검색어 입력"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSearch}>검색</button>
                  </div>
                  <StatisticsTable statistics={paginatedData} category={selectedCategory} />
                  {/* 페이지 네비게이션 */}
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 5, 1))}
                      disabled={currentPage <= 5}
                    >
                      이전
                    </button>
                    {Array.from(
                      { length: Math.min(5, totalPages - Math.floor((currentPage - 1) / 5) * 5) },
                      (_, idx) => {
                        const page = Math.floor((currentPage - 1) / 5) * 5 + idx + 1;
                        return (
                          <button
                            key={page}
                            className={currentPage === page ? 'active' : ''}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 5, totalPages))}
                      disabled={currentPage > totalPages - 5}
                    >
                      다음
                    </button>
                  </div>
                </>
              ) : selectedCategory !== '종료된 투표' &&
                selectedCategory !== '최근 종료한 투표 (7일)' &&
                selectedCategory !== '오래된 투표' &&
                selectedCategory !== '조회수 비례 투표율' ? (
                <ChartRenderer statistics={statistics} category={selectedCategory} />
              ) : null}
              {selectedCategory !== '전체' && (
                <StatisticsTable statistics={statistics} category={selectedCategory} />
              )}
            </>
          )}
        </div>
      </div>
    </RequireAuth>
  );
};

export default PollStatistics;
