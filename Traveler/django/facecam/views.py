from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import StreamingHttpResponse
from django.shortcuts import render
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.models import Model
from pathlib import Path
from PIL import Image
import cv2
import threading
import numpy as np
import matplotlib.pyplot as plt
import os
import mediapipe as mp
from io import BytesIO

import json
# RestAPI를 사용해서 json으로 응답 객체를 생성하기 위한 모듈
# Spring의 @RestController, @ResponseBody 역할
from django.http import JsonResponse

class FeatureExtractor:
    def __init__(self):
        # Use VGG-16 as the architecture and ImageNet for the weight
        base_model = VGG16()
        # base_model = ResNet152()
        # Customize the model to return features from fully-connected layer
        # self.model = Model(inputs=base_model.input, outputs=base_model.get_layer('avg_pool').output)
        self.model = Model(inputs=base_model.input, outputs=base_model.get_layer('fc2').output)
        # print(base_model.summary())
    
    def extract(self, img):
        # Resize the image
        img = img.resize((224, 224))
        # Convert the image color space
        img = img.convert('RGB')
        # print(type(img))
        # Reformat the image
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        # Extract Features
        feature = self.model.predict(x)[0]
        return feature / np.linalg.norm(feature)

class FaceComparison:
    def __init__(self):
        # # 카메라 초기화
        # self.video_capture = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        # self.video_capture.set(cv2.CAP_PROP_FOURCC, self.video_capture.get(cv2.CAP_PROP_FOURCC))
        # self.video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        # self.video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        # self.video_capture.set(cv2.CAP_PROP_FPS, 30)
        
        # 이미지 정보 초기화화
        self.frame_bgr = np.array([])
        
        # Mediapipe FaceMesh 초기화
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        
    def origin_setting(self, imgname):
        # 이미지 불러오기
        self.origin_image_path = f'..\\files\\img\\manager\\{imgname}'

        self.origin_img = cv2.imread(self.origin_image_path)

        # 이미지 로드 확인
        if self.origin_img is None:
            print("Error: Cannot load one or more images")
            exit()

        # BGR → RGB 변환
        self.origin_rgb = cv2.cvtColor(self.origin_img, cv2.COLOR_BGR2RGB)

        self.fe = FeatureExtractor()
        with self.mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, min_detection_confidence=0.5) as face_mesh:
            self.origin_result = face_mesh.process(self.origin_rgb)
            # 얼굴 랜드마크 표시 + 얼굴 자르기
            self.origin_cropped = self.draw_landmarks(self.origin_img, self.origin_result)
            self.origin_query = self.fe.extract(Image.fromarray(self.origin_cropped))    
    
    def draw_landmarks(self, image, results):
        """얼굴 랜드마크를 그리고, 얼굴 바운딩 박스를 계산하여 자른 이미지를 반환"""
        h, w, _ = image.shape
        landmark_image = np.ones((h, w, 3), dtype=np.uint8) * 255  # 흰색 배경
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                for landmark in face_landmarks.landmark:
                    x, y = int(landmark.x * w), int(landmark.y * h)
                    cv2.circle(landmark_image, (x, y), 1, (0, 0, 0), -1)  # 검은색 점으로 랜드마크 표시
                
                # 랜드마크 그리기
                self.mp_drawing.draw_landmarks(image, face_landmarks, mp.solutions.face_mesh.FACEMESH_TESSELATION)

                # 랜드마크 좌표 리스트 생성
                x_coords = [int(lm.x * w) for lm in face_landmarks.landmark]
                y_coords = [int(lm.y * h) for lm in face_landmarks.landmark]

                # 바운딩 박스 계산
                x_min, x_max = max(0, min(x_coords) - 20), min(w, max(x_coords) + 20)
                y_min, y_max = max(0, min(y_coords) - 20), min(h, max(y_coords) + 20)

                # 얼굴 영역 자르기
                # cropped_face = image[y_min:y_max, x_min:x_max]
                cropped_landmark = landmark_image[y_min:y_max, x_min:x_max]
                return cropped_landmark
        return None


    # def generate_frames(self):
    #     while True:
    #         ret, frame = self.video_capture.read()
    #         if not ret or frame is None:
    #             print("프레임을 가져올 수 없습니다.")
    #             break

    #         # print("Frame shape:", frame.shape)  # 프레임 구조 확인
            
    #         flipped_frame = cv2.flip(frame, 1)

    #         # 프레임 변환 필요 여부 확인
    #         if len(flipped_frame.shape) == 3 and flipped_frame.shape[2] == 3:
    #             # 이미 BGR 형식 → 변환 불필요
    #             frameToellipse = flipped_frame
    #         elif len(flipped_frame.shape) == 3 and frame.shape[2] == 2:
    #             # YUYV 형식 → 변환 필요
    #             frameToellipse = cv2.cvtColor(flipped_frame, cv2.COLOR_YUV2BGR_YUYV)
    #         else:
    #             print("알 수 없는 프레임 형식입니다.")
    #             continue
            
    #         center = (frame.shape[1] // 2, frame.shape[0] // 2)  # 화면 중앙
            
    #         self.frame_bgr = frameToellipse[center[1]-200:center[1]+200, center[0]-150:center[0]+150]

    #         # 타원의 중심 좌표, 크기, 회전 각도 설정
    #         axes = (150, 200)  # 타원의 크기 (가로, 세로 반지름)
    #         angle = 0  # 회전 각도
    #         color = (0, 255, 0)  # 초록색 (BGR)
    #         thickness = 2  # 선 두께
        
    #         # 초록색 타원 그리기
    #         cv2.ellipse(frameToellipse, center, axes, angle, 0, 360, color, thickness)

    #         # 글씨 추가 (좌표, 폰트, 크기, 색상, 두께 설정)
    #         text = "Face"
    #         position = (frame.shape[1] // 2 - 40, frame.shape[0] // 2 - 210)  # 좌측 상단
    #         font = cv2.FONT_HERSHEY_SIMPLEX
    #         font_scale = 1
    #         color = (0, 255, 0)  # 초록색
    #         thickness = 2
        
    #         cv2.putText(frameToellipse, text, position, font, font_scale, color, thickness)

    #         # 프레임을 JPEG 형식으로 인코딩
    #         _, buffer = cv2.imencode(".jpg", frameToellipse)
    #         frame_bytes = buffer.tobytes()

    #         # 웹캠 프레임을 HTTP 스트리밍 형태로 반환해서 바이트코드로 ......
    #         yield (b'--frame\r\n'
    #             b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

fc = FaceComparison()

# def video_feed(request):
#     # StreamingHttpResponse 스트림으로 응답해줌 
#     return StreamingHttpResponse(fc.generate_frames(), content_type="multipart/x-mixed-replace; boundary=frame")

@csrf_exempt
def facecam(request):
    img = request.FILES['img']
    imgname = request.POST['imgname']
    
    fc.origin_setting(imgname)
    image = Image.open(BytesIO(img.read()))
    frame_bgr = np.array(image)
    frame_bgr = np.array(frame_bgr[:, :, :3])
    # print(imgname, frame_bgr)
    
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    score = -1
    # FaceMesh 실행
    with fc.mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, min_detection_confidence=0.7) as face_mesh:
        results = face_mesh.process(frame_rgb)
        check_cropped = fc.draw_landmarks(frame_bgr, results)
        
        if check_cropped is not None:
            check_query = fc.fe.extract(Image.fromarray(check_cropped))

            # Calculate the similarity (distance) between images
            score = np.linalg.norm(fc.origin_query - check_query)
    score = float(score)
    return JsonResponse({'score': score})