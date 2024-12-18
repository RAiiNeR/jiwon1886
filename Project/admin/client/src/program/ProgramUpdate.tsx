import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MapForm from '../promote/MapForm';
import "./css/ProgramUpdate.css";

interface Program {
  title: string;
  age: number;
  category: string;
  place: string;
  content: string;
  teacher: string;
  education: number;
  startperiod: string;
  endperiod: string;
  startdeadline: string;
  enddeadline: string;
  starttime: string;
  endtime: string;
  img: string; // 이미지 경로
  mfile: File[]; 
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


const ProgramUpdate: React.FC = () => {
  const { num } = useParams<{ num: string }>(); // URL 파라미터에서 num 추출
  const navigate = useNavigate(); // navigate 함수를 사용하여 페이지 이동
  const filePath = 'http://localhost:82/noorigun/uploads/'; // 이미지 파일 경로
  const [mfile, setMfile] = useState<File | null>(null); // 선택한 파일 상태 관리
  const [form, setForm] = useState<Program>({
    title: '',
    age: 0,
    category:'',
    place: '',
    content: '',
    teacher: '',
    education: 0,
    startperiod: '',
    endperiod: '',
    startdeadline: '',
    enddeadline: '',
    starttime: '',
    endtime: '',
    img:'',
    mfile: [] // 초기값을 빈 배열로 설정
  });
  const [loading, setLoading] = useState(true); // 로딩 상태

  const [isVisiable, setIsVisiable] = useState(false);

  // Date 객체를 'yyyy-MM-dd' 형식으로 변환하는 함수
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // 월은 0부터 시작
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  // 프로그램 세부 정보를 가져오는 함수
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:82/noorigun/api/program/detail?num=${num}`);

        // 서버에서 받은 날짜를 'yyyy-MM-dd' 형식으로 변환
        const formattedStartPeriod = formatDate(new Date(response.data.startperiod));
        const formattedEndPeriod = formatDate(new Date(response.data.endperiod));
        const formattedStartDeadline = formatDate(new Date(response.data.startdeadline));
        const formattedEndDeadline = formatDate(new Date(response.data.enddeadline));

        setForm({
          ...response.data,
          startperiod: formattedStartPeriod,
          endperiod: formattedEndPeriod,
          startdeadline: formattedStartDeadline,
          enddeadline: formattedEndDeadline
        }); // 서버에서 받은 데이터를 form 상태에 설정
      } catch (error) {
        console.error('Error fetching post details:', error); // 오류 처리
      } finally {
        setLoading(false); // 로딩 끝
      }
    };
    fetchDetail();
  }, [num]);

  // 입력값 변경 처리 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // 숫자형 데이터 처리
    if (name === 'age' || name === 'student') {
      setForm({ ...form, [name]: parseInt(value, 10) });//숫자형
    } else {
      setForm({ ...form, [name]: value });//나머지
    }

  };


  // 파일 선택 처리 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMfile(e.target.files[0]); // 첫 번째 파일만 선택 처리
    }
  };

  // 강좌 종류 선택
  const categoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, category: e.target.value });
  };

  // 연령대 선택
  const ageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, age: Number(e.target.value) });
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // startDeadline과 endDeadline 비교
    const startdeadlineDate = new Date(form.startdeadline);
    const enddeadlineDate = new Date(form.enddeadline);

    const startperiod = new Date(form.startperiod);
    const endperiod = new Date(form.endperiod);

    if (startdeadlineDate >= enddeadlineDate) {
      alert('수강신청 마감일은 시작일 이후여야 합니다.');
      return;
    }else if(startperiod >= endperiod){
      alert('강의종료일이 강의시작일보다 이후여야 합니다');
      return;
    }else if(enddeadlineDate > startperiod){
      alert('수강신청마감일은 강의시작일 이전이어야 합니다');
      return;
    }

    // 기본 유효성 검사
    if (!form.title || !form.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

  
  
    const data = new FormData();
    data.append('num', num as string)
    data.append('title', form.title);
    data.append('age', form.age.toString());
    data.append('category', form.category);
    data.append('place', form.place);
    data.append('content', form.content);
    data.append('teacher', form.teacher);
    data.append('education', form.education.toString());
    data.append('startperiod', form.startperiod);
    data.append('endperiod', form.endperiod);
    data.append('startdeadline', form.startdeadline);
    data.append('enddeadline', form.enddeadline);
    data.append('starttime', form.starttime);
    data.append('endtime', form.endtime);
  
    // mfile이 있으면 새 이미지 파일을 추가
    if (mfile) {
      data.append('mfile', mfile);
    } 
    // mfile이 없고, form.img가 있다면 기존 이미지를 그대로 전송
    else if (form.img) {
      data.append('img', form.img);
    }

    if (form.placename) {
      data.append('placename', form.placename);
    }
    if (form.latitude) {
      data.append('latitude', form.latitude.toString());
    }
    if (form.longitude) {
      data.append('longitude', form.longitude.toString());
    }
  
    try {
      // 서버로 수정 요청
      const response = await axios.put('http://localhost:82/noorigun/api/program', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('수정이 완료되었습니다!');
      navigate(`/program/${num}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };


  const handleColse = () => {
    setIsVisiable(false);
  };

  const handleGetMapData = (data: Data) => {
    setForm({
      ...form,
      place: data.placeaddr,
      placename: data.placename,
      latitude: data.latitude,
      longitude: data.longitude,
    });
    setIsVisiable(false);
  };
  
  
  if (loading) {
    return <div>로딩 중...</div>; // 로딩 상태일 때 표시할 메시지
  }

  return (
    <div className="ProgramUpdate">
      <h2>강좌 수정</h2>
      <form onSubmit={handleSubmit}>
        {/* 폼 입력 항목들 */}
        <div className="mb-3">
          <label className="form-label">제목:</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
       
        <div className="mb-3">
          <label className="form-label">수강대상:</label>
          <select
            className="form-control"
            name="age"
            value={form.age}
            onChange={ageChange}
            required
          >
            <option value="" disabled>연령을 선택하세요</option>
            <option value="1">아동</option>
            <option value="2">학생</option>
            <option value="3">노년</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">종류:</label>
          <select
            className="form-control"
            name="category"
            value={form.category}
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

        <div>
          <button type="button" onClick={() => setIsVisiable(true)}>위치 추가</button>
          {form.place && <label>{form.place}</label>}
        </div>

        {isVisiable && <MapForm onChange={handleGetMapData} onClose={handleColse} />}

        <div className="mb-3">
          <label className="form-label">장소:</label>
          <input
            type='text'
            className="form-control"
            name="place"
            value={form.place}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">내용:</label>
          <textarea
            className="form-control"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">강사:</label>
          <input
            type='text'
            className="form-control"
            name="teacher"
            value={form.teacher}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">인원수:</label>
          <input
            type='number'
            className="form-control"
            name="education"
            value={form.education}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">강좌 시작일:</label>
          <input
            type="date"
            className="form-control"
            name="startperiod"
            value={form.startperiod}
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
            value={form.endperiod}
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
            value={form.starttime}
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
            value={form.endtime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">수강신청 시작일:</label>
          <input
            type="date"
            className="form-control"
            name="startdeadline"
            value={form.startdeadline}
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
            value={form.enddeadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">이미지:</label>
          {form.img && !mfile && (
            <div>
              <img
                src={`${filePath}${form.img}`}
                alt="Current Program Image"
                style={{ width: '50%', height: 'auto' }}
              />
              <p>현재 이미지</p>
            </div>
          )}
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
          {mfile && (
            <div>
              <p>선택한 이미지:</p>
              <img
                src={URL.createObjectURL(mfile)}
                alt="Selected Preview"
                style={{ width: '50%', height: 'auto' }}
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" > 수정하기
        </button>
      </form>
    </div>
  );
};

export default ProgramUpdate;
