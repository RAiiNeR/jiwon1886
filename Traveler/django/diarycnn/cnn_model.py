import tensorflow as tf
import numpy as np
from PIL import Image
import os
import dlib
import cv2

# Django 프로젝트 루트 디렉토리 설정
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "diarycnn", "travle_CNN.keras")

# 모델 로드
if os.path.exists(model_path):
    model = tf.keras.models.load_model(model_path)
    print(f"✅ 모델 로드 성공: {model_path}")
else:
    raise FileNotFoundError(f"❌ 모델 파일을 찾을 수 없습니다: {model_path}")

# 이미지 전처리 함수
def preprocess_image(image_path):
    model.summary()
    image = Image.open(image_path).convert("RGB")  # 이미지 열기 및 RGB 변환
    image = image.resize((48, 48))  # 모델 입력 크기에 맞춤
    image = np.array(image) / 255.0  # 정규화 (0~1 범위)
    image = np.expand_dims(image, axis=0)  # 배치 차원 추가
    return image

# CNN 예측 함수
def predict(image_path):
    image_data = preprocess_image(image_path)
    prediction = model.predict(image_data)  # 예측 수행
    
    # 확률값을 퍼센트(%)로 변환 후 float 형식으로 변환
    probabilities = prediction[0] * 100  # 0~1 값을 0~100%로 변환
    probabilities = [round(float(p), 2) for p in probabilities]  # float 변환
    
    # 감정 클래스 매핑
    class_mapping = {0: "당황", 1: "행복", 2: "중립", 3: "슬픔", 4: "분노"}
    
    # 가장 높은 확률을 가진 감정 예측
    predicted_class = int(np.argmax(prediction, axis=1)[0])  # int 변환
    predicted_emotion = class_mapping.get(predicted_class, "알 수 없음")
    
    # 감정 확률을 딕셔너리로 변환
    emotion_probabilities = {
        "당황": probabilities[0],
        "행복": probabilities[1],
        "중립": probabilities[2],
        "슬픔": probabilities[3],
        "분노": probabilities[4]
    }

    return {
        "emotion_probabilities": emotion_probabilities,
        "predicted_emotion": predicted_emotion
    }




# 얼굴 감지 및 박스
def detect_faces(image_path, output_path="output.jpg"):
    detector = dlib.get_frontal_face_detector()
    image = cv2.imread(image_path)  # 이미지 읽기 (BGR 형식)
    
    if image is None:
        raise ValueError(f"이미지 파일을 불러올 수 없습니다: {image_path}")
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # 흑백 변환
    faces = detector(gray)  # 얼굴 감지
    
    for face in faces:
        left, top, right, bottom = face.left(), face.top(), face.right(), face.bottom()
        cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)  # 초록색 박스
    
    # 감지된 얼굴이 없을 경우 메시지 출력
    if len(faces) == 0:
        print("⚠ 얼굴을 감지하지 못했습니다.")
    
    # 박스가 그려진 이미지 저장
    cv2.imwrite(output_path, image)
    print(f"✅ 얼굴 감지 결과 저장 완료: {output_path}")

# 실행 예시
if __name__ == "__main__":
    image_path = "test.jpg"  # 테스트할 이미지 경로
    print(predict(image_path))  # CNN 예측 수행
    detect_faces(image_path, "result.jpg")  # 얼굴 감지 후 저장
