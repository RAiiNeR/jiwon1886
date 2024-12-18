import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapForm from '../promote/MapForm';
import axios from 'axios';
import "./css/ProgramForm.css"

interface Program {
  title: string;
  age: number;
  category:string;
  place: string;
  content: string;
  teacher: string;
  student: number;
  education : number;
  startperiod: string;
  endperiod: string;
  startdeadline: string;
  enddeadline: string;
  starttime: string;
  endtime: string;
  mfile: File[]; // 파일 배열로 수정
  placename?: string;
  latitude?: number;
  longitude?: number;
}

interface Data {
  placeaddr: string;
  placename: string;
  latitude: number;
  longitude: number;
}

const ProgramForm: React.FC = () => {
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program>({
    title: '',
    age: 0,
    category:'',
    place: '',
    content: '',
    teacher: '',
    student: 0,
    education: 0,
    startperiod: '',
    endperiod: '',
    startdeadline: '',
    enddeadline: '',
    starttime: '',
    endtime: '',
    mfile: [] // 초기값을 빈 배열로 설정
  });
  const [isVisiable, setIsVisiable] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProgram({ ...program, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProgram({ ...program, mfile: Array.from(e.target.files) }); // 파일 배열 업데이트
    }
  };

  //강좌 종류 선택
  const categoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setProgram({ ...program, category: value });
  };

  //연령대 선택
  const ageChange=(e: React.ChangeEvent<HTMLSelectElement>)=>{
    const { value } = e.target;
    setProgram({ ...program, age : Number(value) });
  }

  useEffect(() => {
    console.log(program); // 상태 확인용
  }, [program]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // startDeadline과 endDeadline 비교
    const startDeadlineDate = new Date(program.startdeadline);
    const endDeadlineDate = new Date(program.enddeadline);

    const startPeriod = new Date(program.startperiod);
    const endPeriod = new Date(program.endperiod);

    if (startDeadlineDate >= endDeadlineDate) {
      alert('수강신청 마감일은 시작일 이후여야 합니다.');
      return;
    }else if(startPeriod >= endPeriod){
      alert('강의종료일이 강의시작일보다 이후여야 합니다');
      return;
    }else if(endDeadlineDate > startPeriod){
      alert('수강신청마감일은 강의시작일 이전이어야 합니다');
      return;
    }

    if (program.mfile.length === 0) {
        alert('파일을 선택해주세요.');
        return;
      }
      
    if (!program.title || !program.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const data = new FormData();
    data.append('title', program.title);
    data.append('age', program.age.toString());
    data.append('category',program.category);
    data.append('place', program.place);
    data.append('content', program.content);
    data.append('teacher', program.teacher);
    data.append('student', program.education.toString());

    data.append('education', program.education.toString());
    data.append('startperiod', program.startperiod);
    data.append('endperiod', program.endperiod);
    data.append('startdeadline', program.startdeadline);
    data.append('enddeadline', program.enddeadline);
    data.append('starttime', program.starttime);
    data.append('endtime', program.endtime);

    if (program.mfile.length > 0) {
      program.mfile.forEach((file) => {
        data.append('mfile', file); // 서버에서 받는 필드명이 mfiles라고 가정
      });
    }

    if (program.placename) {
      data.append('placename', program.placename);
    }
    if (program.latitude) {
      data.append('latitude', program.latitude.toString());
    }
    if (program.longitude) {
      data.append('longitude', program.longitude.toString());
    }

    try {
      await axios.post('http://localhost:82/noorigun/api/program', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('업로드가 완료되었습니다!');
      navigate('/program');
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
      alert('업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleColse = () => {
    setIsVisiable(false);
  };

  const handleGetMapData = (data: Data) => {
    setProgram({
      ...program,
      place: data.placeaddr,
      placename: data.placename,
      latitude: data.latitude,
      longitude: data.longitude,
    });
    setIsVisiable(false);
  };


  return (
    <div className="ProgramForm">
      <h2 className="mb-4">강의글 업로드</h2>
      <form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <div className="mb-3">
          <label className="form-label">제목:</label>
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="제목을 입력하세요"
            value={program.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* 수강대상 선택 */}
        <div className="mb-3">
          <label className="form-label">수강대상:</label>
          <select
            className="form-control"
            name="age"
            value={program.age}
            onChange={ageChange}
            required
          >
            <option value="0" disabled>연령을 선택하세요</option>
            <option value="1">아동</option>
            <option value="2">학생</option>
            <option value="3">노년</option>
          </select>
        </div>

        {/* 강좌 종류 선택 */}
        <div className="mb-3">
          <label className="form-label">종류:</label>
          <select
            className="form-control"
            name="category"
            value={program.category}
            onChange={categoryChange}
            required
          >
            <option value="" disabled>종류를 선택하세요</option>
            <option value="스포츠">스포츠</option>
            <option value="요리">요리</option>
            <option value="춤/노래">춤/노래</option>
            <option value="키즈">키즈</option>
          </select>
        </div>

        {/* 위치 추가 버튼 */}
        <div className='mapbox'>
          <button type="button" onClick={() => setIsVisiable(true)}>위치 추가</button>
          {program.place && <label>{program.place}</label>}
        </div>

        {/* 지도 모달 */}
        {isVisiable && <MapForm onChange={handleGetMapData} onClose={handleColse} />}

        {/* 장소 입력 */}
        <div className="mb-3">
          <label className="form-label">장소:</label>
          <input
            type="text"
            className="form-control"
            name="place"
            value={program.place}
            onChange={handleChange}
            required
          />
        </div>

        {/* 내용 입력 */}
        <div className="mb-3">
          <label className="form-label">내용:</label>
          <textarea
            className="form-control"
            name="content"
            value={program.content}
            onChange={handleChange}
            required
          />
        </div>

        {/* 강사 입력 */}
        <div className="mb-3">
          <label className="form-label">강사:</label>
          <input
            type="text"
            className="form-control"
            name="teacher"
            value={program.teacher}
            onChange={handleChange}
            required
          />
        </div>

        {/* 수강인원 입력 */}
        <div className="mb-3">
          <label className="form-label">수강인원:</label>
          <input
            type="number"
            className="form-control"
            name="education"
            value={program.education}
            onChange={handleChange}
            required
          />
        </div>

        {/* 날짜 및 시간 입력 */}
        <div className="mb-3">
          <label className="form-label">강좌 시작일:</label>
          <input
            type="date"
            className="form-control"
            name="startperiod"
            value={program.startperiod}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">강좌 종료일:</label>
          <input
            type="date"
            className="form-control"
            name="endperiod"
            value={program.endperiod}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">강좌 시작 시간:</label>
          <input
            type="time"
            className="form-control"
            name="starttime"
            value={program.starttime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">강좌 종료 시간:</label>
          <input
            type="time"
            className="form-control"
            name="endtime"
            value={program.endtime}
            onChange={handleChange}
            required
          />
        </div>

        {/* 수강신청 시작일 및 마감일 입력 */}
        <div className="mb-3">
          <label className="form-label">수강신청 시작일:</label>
          <input
            type="date"
            className="form-control"
            name="startdeadline"
            value={program.startdeadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">수강신청 마감일:</label>
          <input
            type="date"
            className="form-control"
            name="enddeadline"
            value={program.enddeadline}
            onChange={handleChange}
            required
          />
        </div>

        {/* 첨부파일 선택 */}
        <div className="mb-3">
          <label className="form-label">첨부파일</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            multiple
          />
        </div>

        {/* 제출 버튼 */}
        <button type="submit">제출</button>
      </form>
    </div>
  );
};

export default ProgramForm;