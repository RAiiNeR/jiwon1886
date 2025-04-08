import React, { useMemo, useState } from 'react'
import './css/notification.css'
import { formats, modules } from './CustomToolbar'
import ReactQuill from 'react-quill'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import RequireAuth from '../comp/RequireAuth'


const NotificationForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [deptno, setDeptno] = useState('11');
  const [type, setType] = useState('2');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const moduleData = useMemo(() => {
    return modules();
  }, [])

  const todayDate = () => {
    const today = new Date().toLocaleDateString();
    return today;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("통신 시작");
      console.log(title + "," + deptno + "," + type + "," + content)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('deptno', deptno);
      formData.append('type', type);
      formData.append('content', content);
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/noti`, formData);
      console.log(response.data);
      navigate('/noorigun')
    } catch (error) {
      console.log('Error Message => ' + error);
    }
  }

  return (
    <RequireAuth>
      <div className='notificationForm'>
        <form className='noti-form' onSubmit={handleSubmit}>
          <div className="mb-3 row">
            <label htmlFor="title" className='col-sm-1 col-form-label'>제목</label>
            <div className="col-sm-11">
              <input
                type="text"
                id="title"
                name="title"
                placeholder="제목을 입력하세요"
                maxLength={50}
                className='form-control'
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="deptno" className='col-sm-1 col-form-label'>부서</label>
            <div className="col-sm-3 d-flex">
              <select name="deptno" id="deptno" onChange={e => setDeptno(e.target.value)}>
                <option value="11">감사담당관</option>
                <option value="12">기획예산담당관</option>
                <option value="21">홍보담당관</option>
                <option value="22">안전복지정책관</option>
                <option value="23">민원토지관</option>
                <option value="31">일자리경제관</option>
                <option value="32">정원산림관</option>
              </select>
            </div>
            <label htmlFor="type" className='col-sm-1 col-form-label'>종류</label>
            <div className="col-sm-4 d-flex">
              <select name="type" id="type" className='text-center' onChange={e => setType(e.target.value)}>
                <option value="1">긴급</option>
                <option value="2" selected={true}>일반</option>
                <option value="3">조치</option>
              </select>
            </div>
            <div className='col-sm-3 col-form-label'>
              작성일: {todayDate()}
            </div>
          </div>
          <hr />
          <div className="mb-5">
            <ReactQuill
              theme="snow"
              modules={moduleData}
              formats={formats}
              onChange={e => setContent(e)}
              className='noti-content'
            />
          </div>
          <div className='btn-div'>
            <button type='submit' className='btn btn-primary me-3'>전송</button>
            <button className='btn btn-danger' onClick={_ => navigate(-1)}>취소</button>
          </div>
        </form>
      </div>
    </RequireAuth>
  )
}

export default NotificationForm