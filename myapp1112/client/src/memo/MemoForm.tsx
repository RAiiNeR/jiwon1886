import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface FormData{
    id:number;
    title:string;
    memocont:string;
    writer:string;
    mdate:string;
}

const MemoForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        id:0,
        title:'',
        writer:'',
        memocont:'',
        mdate:''
    });

    const navigate = useNavigate();
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} =e.target;
        setFormData({
            ...formData,
            [name]:value,
        });
    }


    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('id', formData.id.toString());
        formDataToSubmit.append('title', formData.title);
        formDataToSubmit.append('writer', formData.writer);
        formDataToSubmit.append('memocont', formData.memocont);

        try {
            //env에서 선언한 환경변수를 적용한다
            const response=await fetch(`${process.env.REACT_APP_BACK_END_URL}/api/memo`, {
                method:'POST',
                body:formDataToSubmit,
            });
            const result = await response.json();
            console.log('서버 응답 : ', result);
        } catch (error) {
            console.log('에러',error);
        }
    }


  return (
    <div className='container mt-4'>
      <h1 className='mb-4'>메모 등록 폼</h1>
      <div className='mb-3'>
        <img src="/back/img/monkey1.png" alt="샘플 이미지" style={{width:'120px'}} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className='mb3'>
            <label htmlFor="title" className='form-label'>제목</label>
            <input type="text" className='form-control' id='title' name='title' onChange={handleChange}/>
        </div>

        <div className='mb3'>
            <label htmlFor="memocont" className='form-label'>설명</label>
            <input type="text" className='form-control' id='memocont' name='memocont' onChange={handleChange}/>
        </div>

        <div className='mb3'>
            <label htmlFor="writer" className='form-label'>작성자</label>
            <input type="text" className='form-control' id='writer' name='writer' onChange={handleChange}/>
        </div>

        <button type='submit' className='btn btn-primary'>등록</button>
      </form>
    </div>
  )
}

export default MemoForm