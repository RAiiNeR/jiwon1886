from django.shortcuts import render
import os
import re
import pickle
import numpy as np
import base64
import matplotlib.pyplot as plt
from io import BytesIO
from collections import Counter
from wordcloud import WordCloud
from PIL import Image
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from konlpy.tag import Okt
from PIL import Image

# Django 프로젝트 기본 경로 설정
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "chatbotwordcloud")  # 모델 저장 폴더
LOGS_DIR = os.path.join(BASE_DIR, "..\\files\\logs")  # 로그 파일 폴더
IMAGE_PATH = os.path.join(BASE_DIR, "..\\admin\\client\\public\\images\\map.png")  # map.png의 실제 경로
FONT_PATH = os.path.join(MODEL_DIR, "fonts\\NanumSquareR.ttf")  # 한글 폰트



# 모델 및 벡터 불러오기
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl") # 저장된 모델 파일
VECTORIZER_PATH = os.path.join(MODEL_DIR, "vectorizer.pkl") # 텍스트 벡터 변환기 파일

# 모델과 벡터 변환기 로드
if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f) # 저장된 모델 로드

    with open(VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f) # 벡터 변환기 로드
else:
    model = None  # 모델이 없을 경우 None으로 설정
    vectorizer = None
    print("모델 파일이 존재하지 않습니다.")

# 형태소 분석기 선언
okt = Okt()

def process_log_files(log_folder):
    log_files = [os.path.join(log_folder, f) for f in os.listdir(log_folder)
                 if f.startswith("Log_Bot") and f.endswith("_test.log")]
    text_data = "" # 전체 로그 텍스트 데이터를 저장할 변수

    for file_path in log_files:
        with open(file_path, "r", encoding="utf-8") as file:
            text_data += file.read() + "\n"

    words = okt.nouns(text_data) # 명사만 추출
    words = [word for word in words if len(word) > 1]
    word_counts = Counter(words) # 단어 빈도수 계산
    return words, word_counts

def analyze_log(words):
    """ 모델을 활용한 분석 """
    if model and vectorizer:
        X = vectorizer.transform([" ".join(words)]) # 단어 리스트를 벡터화
        prediction = model.predict(X) # 예측 수행
        return prediction[0]  # 예측 결과 반환
    else:
        return "모델이 로드되지 않았습니다."

@csrf_exempt
def generate_wordcloud_api(request):
    if request.method == "GET": # GET 요청 허용
        words, word_counts = process_log_files(LOGS_DIR)
        # map.png 이미지를 마스크로 사용하여 워드클라우드 생성
        imgMask = np.array(Image.open(IMAGE_PATH).convert("L").resize((360, 580)))
        
        wordcloud = WordCloud(
            font_path=FONT_PATH,  # 한글 폰트 적용
            background_color="white", # 배경 흰색
            mask=imgMask, # 마스크 이미지 적용
            contour_width=1, # 테두리 두께
            contour_color="black", # 테두리 색상
            relative_scaling=0.5  # 단어 크기 조절 비율
        ).generate_from_frequencies(word_counts) # 단어 빈도 기반으로 워드클라우드 생성
        
        # 이미지를 Base64로 변환
        buffer = BytesIO()
        wordcloud.to_image().save(buffer, format="PNG") # PNG 형식으로 저장
        base64_image = base64.b64encode(buffer.getvalue()).decode()
        return JsonResponse({"wordcloud": base64_image}) # JSON 응답 반환
        # 잘못된 요청 방식 처리
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def upload_log(request):
    """ logs 폴더 내 모든 로그 파일을 자동으로 분석하여 결과 반환 """
    words, word_counts = process_log_files(LOGS_DIR) # 로그 파일에서 단어 및 빈도 분석 수행
    prediction = analyze_log(words) # 모델을 이용한 분석 수행
    # 분석 결과를 HTML 페이지에 전달
    return render(request, "chatbotwordcloud/result.html", {"prediction": prediction})