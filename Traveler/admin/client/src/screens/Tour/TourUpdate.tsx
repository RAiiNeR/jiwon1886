import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Location {
  day: number;
  place: string;
  content: string;
}

interface Tour {
  name: string;
  content: string;
  location: string;
  theme: string;
  videoLink: string;
  thumbnail: File | null;
  thumbnailUrl: string;
  images: File[];
  imageUrls: string[];
  schedules: Location[];
}

const TourUpdate: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();

  const [tour, setTour] = useState<Tour>({
    name: "",
    content: "",
    location: "서울",
    theme: "EP",
    videoLink: "",
    thumbnail: null,
    thumbnailUrl: "",
    images: [],
    imageUrls: [],
    schedules: [{ day: 1, place: "", content: "" }],
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours/${tourId}`);
        const data = response.data;
        
        setTour({
          name: data.name,
          content: data.content,
          location: data.location,
          theme: data.theme,
          videoLink: data.videoLink,
          thumbnail: null,
          thumbnailUrl: data.thumbnail ? `${process.env.REACT_APP_FILES_URL}/img/tour/${data.thumbnail}` : "",
          images: [],
          imageUrls: data.images ? data.images.map((img: { img_name: string }) => `${process.env.REACT_APP_FILES_URL}/img/tour/${img.img_name}`) : [],
          schedules: data.schedules || [{ day: 1, place: "", content: "" }],
        });

      } catch (error) {
        console.error("❌ 투어 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchTour();
  }, [tourId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTour((prev) => ({ ...prev, [name]: value }));
  };

  const MBTI_CATEGORIES = ["EP", "EJ", "IP", "IJ"];

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTour((prev) => ({ ...prev, thumbnail: file, thumbnailUrl: URL.createObjectURL(file) }));
    }
  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTour((prev) => ({
        ...prev,
        images: [...prev.images, file],
        imageUrls: [...prev.imageUrls, URL.createObjectURL(file)],
      }));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setTour((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };
  const handleLocationChange = (index:number,field:keyof Location,value:string | number) =>{
    setTour((prev) => {
      const newLocations = [...prev.schedules];
      newLocations[index] = {...newLocations[index],[field]:value};
      return {...prev,schedules:newLocations};
    });
  };
  const addLocation = () => {
    if (tour.schedules.length < 20) {
      setTour((prev) => ({
        ...prev,
        schedules: [...prev.schedules, { day: prev.schedules.length + 1, place: "", content: "" }],
      }));
    }
  };
  const removeLocation = (index: number) => {
    setTour((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  const styles: { [key: string]: React.CSSProperties } = {
    imageContainer: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    uploadBox: {
      position: "relative",
      width: "120px",
      height: "120px",
      border: "2px dashed #ccc",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderRadius: "8px",
      cursor: "pointer",
    },
    fileInput: {
      position: "absolute",
      width: "100%",
      height: "100%",
      opacity: 0,
      cursor: "pointer",
    },
    imagePreview: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    removeButton: {
      position: "absolute",
      top: "5px",
      right: "5px",
      background: "black",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      cursor: "pointer",
      fontSize: "12px",
    },
    textarea: {
      height: "100px",
      overflowY: "auto",
      resize: "none",
    },
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/api/tours/${tourId}`,
        {
          name: tour.name,
          content: tour.content,
          location: tour.location,
          theme: tour.theme,
          videoLink: tour.videoLink,
          schedules: tour.schedules,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("✅ 투어 업데이트 성공:", response.data);
      alert("투어가 성공적으로 업데이트되었습니다!");
      navigate("/tourlist");
    } catch (error) {
      console.error("❌ 투어 업데이트 실패:", error);
      alert("투어 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="container mt-5">
    <h1 className="mb-4">투어 수정</h1>
    <form onSubmit={handleUpdate}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          투어 이름
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={tour.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">투어 장소</label>
        <select
          className="form-select"
          name="location"
          value={tour.location}
          onChange={handleInputChange}
          required
        >
          <option value="서울">서울</option>
          <option value="제주도">제주도</option>
          <option value="부산">부산</option>
          <option value="강원도">강원도</option>
          </select>
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          투어 설명
        </label>
        <textarea
          className="form-control"
          id="content"
          name="content"
          value={tour.content}
          onChange={handleInputChange}
          style={styles.textarea}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">추천 카테고리 (MBTI 기반)</label>
        <select
          className="form-select"
          name="theme"
          value={tour.theme}
          onChange={handleInputChange}
          required
        >
          {MBTI_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="videoLink" className="form-label">
          비디오 링크
        </label>
        <input
          type="text"
          className="form-control"
          id="videoLink"
          name="videoLink"
          value={tour.videoLink}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">대표 이미지</label>
        <div style={styles.imageContainer}>
          <div style={styles.uploadBox}>
            <input
              type="file"
              style={styles.fileInput}
              accept="image/*"
              onChange={handleThumbnailUpload}
            />
            {tour.thumbnailUrl ? (
              <img
                src={tour.thumbnailUrl}
                alt="대표 이미지"
                style={styles.imagePreview}
              />
            ) : (
              <span>+</span>
            )}
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">추가 이미지</label>
        <div style={styles.imageContainer}>
          {tour.imageUrls.map((imageUrl, index) => (
            <div key={index} style={styles.uploadBox}>
              <img
                src={imageUrl}
                alt={`추가 이미지 ${index + 1}`}
                style={styles.imagePreview}
              />
              <button
                style={styles.removeButton}
                type="button"
                onClick={() => removeAdditionalImage(index)}
              >
                ×
              </button>
            </div>
          ))}
          <div style={styles.uploadBox}>
            <input
              type="file"
              style={styles.fileInput}
              accept="image/*"
              onChange={handleAdditionalImageUpload}
            />
          </div>
        </div>
      </div>
      <div className="mb-3">
        {tour.schedules.map((location, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <select
                className="form-select mb-2"
                value={location.day}
                onChange={(e) =>
                  handleLocationChange(index, "day", parseInt(e.target.value))
                }
              >
                {[1, 2, 3, 4, 5].map((day) => (
                  <option key={day} value={day}>
                    {day}일차
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="장소 이름"
                value={location.place}
                onChange={(e) =>
                  handleLocationChange(index, "place", e.target.value)
                }
              />
              <textarea
                className="form-control mb-2"
                placeholder="장소 설명"
                value={location.content}
                onChange={(e) =>
                  handleLocationChange(index, "content", e.target.value)
                }
                style={styles.textarea}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeLocation(index)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          onClick={addLocation}
        >
          + 스케줄 추가
        </button>
      </div>
      <button type="submit" className="btn btn-success">
        투어 수정
      </button>
    </form>
  </div>
);
};

export default TourUpdate;
