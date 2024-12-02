import axios from 'axios';
import React, { useState } from 'react'
import { Await, useNavigate } from 'react-router-dom';

const UpboardForm: React.FC = () => {
    //form의 경우에는 자바객체 타입으로 저장 {attr:value}
    const [formData, setFormData] = useState({
        title:'',
        writer:'',
        content:'',
        mfile:null as File | null
    });

    const handlerChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name,value} = e.target;
        setFormData({...formData, [name]:value})
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) { //타겟에 파일이 존재했을때만(파일업로드가 존재하면) 저장
             setFormData({...formData,mfile:e.target.files[0]})
        }
    }

    const navigate = useNavigate();
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title',formData.title);
        data.append('writer',formData.writer);
        data.append('content',formData.content);
        if (formData.mfile) {
            data.append('mfile',formData.mfile);
        }
        //----------------여기까지 useState에 저장된 값을 찾아와서 다시 FormData에 모든값을 저장

        try {
            //폼의 속성 예시 => encType = 'multipart/form-data'
            await axios.post('http://192.168.0.90/myictstudy/upboard/upboardAdd',data,{
                headers:{'Content-Type' : 'multipart/form-data'}
            });
            //리스트로 이동
            navigate('/upboard');
        } catch (error) {
            console.log(`Erro => ${error}`);
        }
        console.log(`Form Submit Click! Title =${formData.title}, Writer =${formData.writer}`);
    }

  return (
    <div className='container mt-4'>
      <h2 className='mb-4'>게시판 업로드 예제</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
            <label className='form-label'>Title : </label>
            <input type="text" name='title' className='form-control' required value={formData.title} onChange={handlerChange} />
        </div>

        <div className='mb-3'>
            <label className='form-label'>Writer : </label>
            <input type="text" name='writer' className='form-control' required value={formData.writer} onChange={handlerChange}/>
        </div>

        <div className='mb-3'>
            <label className='form-label'>Content : </label>
            <textarea name='content' className='form-control' value={formData.content} onChange={handlerChange}></textarea>
        </div>

        <div className='mb-3'>
            <label className='form-label'>Upload Image : </label>
            <input type="file" name='mfile' className='form-control' required onChange={handleFileChange}/>
        </div>

        <button type='submit' className='btn btn-primary'>전송</button>
      </form>
    </div>
  )
}

export default UpboardForm