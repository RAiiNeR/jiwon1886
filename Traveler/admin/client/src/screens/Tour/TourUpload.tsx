import axios from "axios";
import React, { useState } from "react";

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
  images: File[];
  schedules: Location[];
}

const TourUpload: React.FC = () => {
  const [newTour, setNewTour] = useState<Tour>({
    name: "",
    content: "",
    location: "서울",
    theme: "EP",
    videoLink: "",
    thumbnail: null,
    images: [],
    schedules: [{ day: 1, place: "", content: "" }],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTour((prev) => ({ ...prev, [name]: value }));
  };

  const MBTI_CATEGORIES = ["EP", "EJ", "IP", "IJ"];

  // ✅ 대표 이미지 업로드
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewTour((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewTour((prev) => ({
        ...prev,
        images: [...prev.images, file],
      }));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setNewTour((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleLocationChange = (index: number, field: keyof Location, value: string | number) => {
    setNewTour((prev) => {
      const newLocations = [...prev.schedules];
      newLocations[index] = { ...newLocations[index], [field]: value };
      return { ...prev, schedules: newLocations };
    });
  };

  const addLocation = () => {
    if (newTour.schedules.length < 20) {
      setNewTour((prev) => ({
        ...prev,
        schedules: [
          ...prev.schedules,
          { day: prev.schedules.length, place: "", content: "" },
        ],
      }));
    }
  };

  const removeLocation = (index: number) => {
    setNewTour((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };


  // ✅ 백엔드로 데이터 전송
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // ✅ JSON 데이터 추가 (string으로 변환)
    const jsonData = {
      name: newTour.name,
      content: newTour.content,
      location: newTour.location,
      theme: newTour.theme,
      videoLink: newTour.videoLink,
      images: newTour.images.map((file) => ({
        img_name: file.name,
      })),
      schedules: newTour.schedules.map((location) => ({
        day: location.day,
        place: location.place,
        content: location.content,
      })),
      days: newTour.schedules.length > 0 ? Math.max(...newTour.schedules.map(schedule => schedule.day)) : 0,
      rating: 0,
      hit: 0,
    };
  
    formData.append("jsonData", JSON.stringify(jsonData));
  
    // ✅ 대표 이미지 추가
    if (newTour.thumbnail) {
      formData.append("thumbnail", newTour.thumbnail);
    }
  
    // ✅ 추가 이미지 추가
    newTour.images.forEach((file) => {
      formData.append("additionalImages", file);
    });
  
    // ✅ FormData 디버깅
    console.log("📢 FormData 내용:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: File Name - ${pair[1].name}`);
      } else {
        console.log(`${pair[0]}:`, pair[1]);
      }
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/tours/upload`, formData);
      console.log("✅ 투어 등록 성공:", response.data);
      alert("투어가 성공적으로 등록되었습니다!");
    } catch (error) {
      console.error("❌ 투어 등록 실패:", error);
      alert("투어 등록에 실패했습니다.");
    }
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

  return (
    <div className="container mt-5">
      <h1 className="mb-4">새 투어 등록</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            투어 이름
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={newTour.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">투어 장소</label>
          <select
            className="form-select"
            name="location"
            value={newTour.location}
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
            value={newTour.content}
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
            value={newTour.theme}
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
            value={newTour.videoLink}
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
            {newTour.thumbnail ? (
              <img src={URL.createObjectURL(newTour.thumbnail)} alt="대표 이미지" style={styles.imagePreview} />
            ) : (
              <span>+</span>
            )}
          </div>
        </div>
      </div>

      {/* ✅ 추가 이미지 업로드 */}
      <div className="mb-3">
        <label className="form-label">추가 이미지</label>
        <div style={styles.imageContainer}>
          {newTour.images.map((image, index) => (
            <div key={index} style={styles.uploadBox}>
              <img src={URL.createObjectURL(image)} alt={`추가 이미지 ${index + 1}`} style={styles.imagePreview} />
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
          {newTour.schedules.map((location, index) => (
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
          투어 등록
        </button>
      </form>
    </div>
  );
};

export default TourUpload;