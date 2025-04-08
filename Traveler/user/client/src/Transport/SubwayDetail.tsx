import React, { useEffect, useState } from 'react';
import { Select, Tag, Card, Row, Col, Checkbox, Pagination } from "antd";
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { updateHalfHeight } from "../Comm/CommomFunc";
import "../css/subway.css";

const { Option } = Select;

const SubwayDetail: React.FC = () => {
  const [selectedLine, setSelectedLine] = useState<string | undefined>(undefined);
  const [trainData, setTrainData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]); // 필터 상태 관리 (열차 상태 필터)
  const [filterExpedited, setFilterExpedited] = useState<boolean | null>(null); // 급행 여부 필터

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const API_URL = "http://swopenapi.seoul.go.kr/api/subway/47514f676863686c3732766d464674/json/realtimePosition/0/100/";

  // 실시간 데이터 갱신 주기 (예: 30초마다 갱신)
  const pollingInterval = 30000; // 30초

  // 실시간 지하철 api 가져오기
  useEffect(() => {
    const fetchTrainData = () => {
      if (!selectedLine) return;

      setLoading(true); // 로딩 시작
      fetch(`${API_URL}${encodeURIComponent(selectedLine)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("네트워크 에러");
          }
          return response.json();
        })
        .then((data) => {
          if (data.realtimePositionList) {
            const filteredData = data.realtimePositionList.map((train: any) => ({
              subwayNm: train.subwayNm || "정보 없음",
              statnNm: train.statnNm || "정보 없음",
              trainNo: train.trainNo || "정보 없음",
              statnTnm: train.statnTnm || "정보 없음",
              trainSttus: train.trainSttus || "정보 없음",
              directAt: train.directAt || "정보 없음",
            }));

            // 필터링 적용
            let filteredResults = filteredData;

            if (filterStatus.length > 0) {
              filteredResults = filteredResults.filter((train: any) =>
                filterStatus.includes(train.trainSttus)
              );
            }

            if (filterExpedited !== null) {
              filteredResults = filteredResults.filter((train: any) =>
                train.directAt === (filterExpedited ? "1" : "0")
              );
            }
            setTrainData(filteredResults);
            setTotal(filteredResults.length); // 전체 데이터 개수 업데이트

          }
          setLoading(false); // 로딩 종료
        })
        .catch((error) => {
          console.error("Error fetching train data:", error);
          setLoading(false); // 로딩 종료
        });
    };

    // 데이터 갱신
    fetchTrainData();
    const intervalId = setInterval(fetchTrainData, pollingInterval);

    // 컴포넌트 언마운트 시 interval 해제
    return () => clearInterval(intervalId);
  }, [selectedLine, filterStatus, filterExpedited]); // selectedLine, filterStatus, filterExpedited 변경 시마다 데이터 갱신

  // 열차 진입 상태 개시하기
  const getTrainStatusTag = (status: any) => {
    switch (status) {
      case "0": return <Tag color="red"><CheckCircleOutlined /> 운행 중</Tag>;
      case "1": return <Tag color="blue"><LoadingOutlined /> 진입</Tag>;
      case "2": return <Tag color="green"><CheckCircleOutlined /> 도착</Tag>;
      // case "3": return <Tag color="red"><CloseCircleOutlined /> 출발</Tag>;
      // default: return <Tag color="gray">정보 없음</Tag>;
    }
  };

  useEffect(() => {
    updateHalfHeight();
    window.addEventListener("resize", updateHalfHeight);
    return () => {
      window.removeEventListener("resize", updateHalfHeight);
    };
  }, []);
// 페이지 변경 시 호출되는 함수
const handlePageChange = (page: number) => {
  setCurrentPage(page); // 페이지 번호 변경
};

// 페이지에 맞는 데이터 필터링
const paginatedData = trainData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return (
    <div>
      <div className="hero-wrap js-halfheight transport"

        style={{ backgroundImage: "url('../images/transport/trans2.jpg')" }} />

      <div className="statustrain">
        <h1>🚇 실시간 지하철 현황</h1>
        <Select
          className="lineselect"
          value={selectedLine}
          onChange={setSelectedLine}
          placeholder="노선 선택"
        >
          {/* 노선 선택 후 해당 데이터 반복 */}
          {["1호선", "2호선", "3호선", "4호선", "5호선", "6호선", "7호선", "8호선", "9호선"].map((line) => (
            <Option key={line} value={line}>
              {line}
            </Option>
          ))}
        </Select>

        {/* 필터 설정 */}
        <div style={{ marginTop: 20 }}>

          {/* 열차 상태 필터 */}
          <Checkbox.Group
            style={{ display: "block" }}
            value={filterStatus}
            onChange={(checkedValues) => setFilterStatus(checkedValues as string[])}
          >
            <Checkbox value="0">운행 중</Checkbox>
            <Checkbox value="1">진입</Checkbox>
            <Checkbox value="2">도착</Checkbox>
          </Checkbox.Group>

          {/* 급행 여부 필터 */}
          <div style={{ marginTop: 10 }}>
            <Checkbox
              checked={filterExpedited === true}
              onChange={() => setFilterExpedited(true)}
            >
              급행
            </Checkbox>
            <Checkbox
              checked={filterExpedited === false}
              onChange={() => setFilterExpedited(false)}
            >
              일반
            </Checkbox>
          </div>
        </div>

        {/* 로딩 중일 때 */}
        {loading ? (
          <div className="text-center">
            <LoadingOutlined spin style={{ fontSize: 24 }} />
            <p>데이터를 불러오는 중...</p>
          </div>
        ) : (
          <Row gutter={16}>
            {paginatedData.length > 0 ? (
              paginatedData.map((train: any) => (
                <Col span={8} key={train.trainNo}>
                  <Card className="traininformation">
                    <p><strong>현재역:</strong> {train.statnNm}</p>
                    <p><strong>목적지:</strong> {train.statnTnm}</p>
                    <p><strong>열차 상태:</strong> {getTrainStatusTag(train.trainSttus)}</p>
                    <p><strong>급행 여부:</strong> {train.directAt === "1" ? "급행" : "일반"}</p>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <p>열차 정보가 없습니다.</p>
              </Col>
            )}
          </Row>
        )}
         {/* 페이징 컴포넌트 추가 */}
         {trainData.length > 0 && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
            style={{ marginTop: 20, textAlign: 'center' }}
          />
        )}
      </div>
    </div>
  );
};

export default SubwayDetail;
