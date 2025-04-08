import React, { useEffect, useState } from 'react';
import '../../css/tourSchedule.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// ✅ 일정 항목 인터페이스
interface ScheduleItem {
    title: string;
    type: string;
    description: string;
}
// 🟢 백엔드에서 받은 일정 데이터 구조 정의
interface TourSchedule {
    day: number;
    place: string;
    content: string;
}

// ✅ TourSchedule 컴포넌트에 전달할 props 타입
interface TourScheduleProps {
    schedules?: Record<number, ScheduleItem[]>; // { 1: [{title, type, description}], 2: [...] }
}

const TourSchedule: React.FC<TourScheduleProps> = ({ schedules }) => {
    const { tourId } = useParams<{ tourId: string }>(); // ✅ URL에서 tourId 가져오기
    const [selectedDay, setSelectedDay] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [scheduleData, setScheduleData] = useState<Record<number, ScheduleItem[]>>({});
    const [loading, setLoading] = useState(true);

    // ✅ 백엔드에서 일정 데이터 가져오기
    useEffect(() => {
        if (!tourId) return;
    
        axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours/${tourId}/schedules`)
            .then((response) => {
                const data: TourSchedule[] = response.data; // ✅ 명시적으로 TourSchedule 배열 타입 지정
    
                const formattedData = data.reduce((acc: Record<number, ScheduleItem[]>, item: TourSchedule) => {
                    const scheduleItem: ScheduleItem = {
                        title: item.place,  
                        type: "일정",  
                        description: item.content,
                    };
    
                    if (!acc[item.day]) {
                        acc[item.day] = [];
                    }
                    acc[item.day].push(scheduleItem);
    
                    return acc;
                }, {} as Record<number, ScheduleItem[]>);
    
                setScheduleData(formattedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('일정 데이터를 불러오는 중 오류 발생:', error);
                setLoading(false);
            });
    }, [tourId]);
    
    

    // ✅ 일정 저장 핸들러 (클릭 시 알림)
    const handleSaveSchedule = () => {
        alert('일정이 내 일정으로 저장되었습니다!');
    };

    // ✅ 수정 모드 토글 핸들러
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    // ✅ 일정 제목 변경 핸들러
    const handleTitleChange = (day: number, index: number, newTitle: string) => {
        const newSchedule = { ...scheduleData };
        if (newSchedule[day]) {
            newSchedule[day][index].title = newTitle;
            setScheduleData(newSchedule);
        }
    };

    return (
        <div className="tour-schedule-container">
            <h2 className="tour-schedule-title">여행 일정</h2>

            {/* ✅ 날짜별 탭 버튼 (동적으로 생성) */}
            <div className="tour-schedule-tabs">
                {Object.keys(scheduleData).map((day) => (
                    <button
                        key={day}
                        className={`tour-schedule-tab-btn ${selectedDay === Number(day) ? 'active' : ''}`}
                        onClick={() => setSelectedDay(Number(day))}
                    >
                        Day {day}
                    </button>
                ))}
            </div>

            {/* ✅ 일정 리스트 (선택한 날짜의 일정만 표시) */}
            <div className="tour-schedule-timeline">
                {loading ? (
                    <p className="tour-schedule-loading">데이터 로딩 중...</p>
                ) : scheduleData[selectedDay]?.length > 0 ? (
                    scheduleData[selectedDay].map((item, index) => (
                        <div key={index} className="tour-schedule-step">
                            <div className="tour-schedule-step-number">{index + 1}</div>
                            <div className="tour-schedule-step-content">
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleTitleChange(selectedDay, index, e.target.value)}
                                        className="tour-schedule-edit-input"
                                    />
                                ) : (
                                    <h4 className="tour-schedule-step-title">
                                        {item.title} <small></small>
                                    </h4>
                                )}
                                <p className="tour-schedule-step-desc">{item.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="tour-schedule-no-data">일정이 없습니다.</p>
                )}
            </div>

            {/* ✅ 버튼 영역 */}
            <div className="tour-schedule-buttons">
                {/* <button className="tour-schedule-save-btn" onClick={handleSaveSchedule}>
                    내 일정으로 담기
                </button>
                <button className="tour-schedule-edit-btn" onClick={toggleEditMode}>
                    {editMode ? '완료' : '내 입맛대로 수정'}
                </button> */}
                <button className="tour-schedule-ref-btn">
                    <Link to="/traveler/community">다른 일정 구경하기</Link>
                </button>
            </div>
        </div>
    );
};

export default TourSchedule;
