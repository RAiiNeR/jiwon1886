import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../comp/RequireAuth';
interface FormData {
  gno: number;
  writer: string;
  title: string;
  description: string;
  images: File[]; // 여러 파일을 저장할 수 있도록 수정
}

const GalleryForm = () => {
  const [formData, setFormData] = useState<FormData>({
    gno: 0,
    writer: '',
    title: '',
    description: '',
    images: [],
  });

  const [previews, setPreviews] = useState<string[]>([]);

  const navigate = useNavigate();

  // onChange할 때 파일이냐 아니냐를 구분해서
  // 파일이면 미리보기 한 다음에 파일을 전송하기 위해서 FormData의 상태값에 넣는다.
  // 나머지는 문자열이니까 value로 넣고..
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'images' && files) {
      const fileArray = Array.from(files);
      const filePreviews = fileArray.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
        });
      });

      Promise.all(filePreviews).then(previewUrls => {
        setPreviews(previewUrls);
      });

      setFormData({
        ...formData,
        images: fileArray,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('gno', formData.gno.toString());
    formDataToSubmit.append('writer', formData.writer);
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('description', formData.description);
    formData.images.forEach((file, index) => {
    formDataToSubmit.append(`images`, file);
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/api/gallery`, {
        method: 'POST',
        body: formDataToSubmit,
      });
      const result = await response.json();
      console.log('서버 응답:', result);
       navigate('/back/gallery'); // 등록 성공 시 갤러리 리스트 페이지로 이동
    } catch (error) {
      console.error('전송 오류:', error);
    }
  };

  return (
    <>
    <RequireAuth>
    <div className="container mt-4">
      <h1 className="mb-4">갤러리 등록 폼</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">제목</label>
          <input type="text" className="form-control" id="title" name="title" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">설명</label>
          <input type="text" className="form-control" id="description" name="description" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="writer" className="form-label">작성자</label>
          <input type="text" className="form-control" id="writer" name="writer" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">이미지 파일</label>
          <input type="file" className="form-control" id="images" name="images" multiple onChange={handleChange} />
        </div>
        {previews.length > 0 && (
          <div className="mb-3">
            <label className="form-label">미리보기</label>
            <div>
              {previews.map((preview, index) => (
                <img key={index} src={preview} alt={`미리보기 ${index}`} className="img-thumbnail" style={{ marginRight: '10px', marginBottom: '10px', width: '150px', height: '150px' }} />
              ))}
            </div>
          </div>
        )}
        <button type="submit" className="btn btn-primary">등록</button>
      </form>
    </div>
    </RequireAuth>  
    </>
  );
};

export default GalleryForm;
