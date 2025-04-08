import google.generativeai as genai
from dotenv import load_dotenv
from .mod import OpenAIKeys  # API 키를 설정하는 함수
import random

load_dotenv()  # .env 파일에서 환경변수 로드

# Gemini API 설정
genai.configure(api_key=OpenAIKeys())

def list_available_models():
    try:
        models = genai.list_models()
        for model in models:
            print(model)
    except Exception as e:
        print(f"모델 목록을 가져오는 중 오류 발생: {e}")


def generate_title(comment, emotion):
    prompt = f"다음 감정 '{emotion}'과 관련된 코멘트 '{comment}'를 반영한 다이어리 제목을 10자 이내로 만들어줘."
    
    try:
        # 올바른 모델 이름으로 수정
        model = genai.GenerativeModel("models/gemini-1.5-flash") 
        response = model.generate_content(prompt)

        # 결과가 있으면 반환, 없으면 기본 값 "무제" 반환
        titles = response.text.strip().split("\n")
        title = titles[0].lstrip("*").strip() if titles else "무제"
        
        
        return title
    
    except Exception as e:
        print(f"Gemini API 호출 오류: {e}")
        return "무제"
