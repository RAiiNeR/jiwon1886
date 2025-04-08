import google.generativeai as genai
from datetime import datetime

class GeminiChat:
    def __init__(self,APIKey,model="gemini-2.0-flash", initial_prompt="""
        100자 이내로 대답해,
        너는 여행관련 통합 서비스 사이트의 챗봇이야,
        우리 사이트는 여행 정보와 교통(고속버스, 지하철, 길찾), 숙소에 대한 정보를 제공해,
        숙소는 제휴업체를 통해 추가돼,
        교통과 관련된 문의 1대1 문의를 통해 문의하라고 해줘,
        우리 사이트 메뉴는 (여행, 여행다이어리, 숙박, 대중교통, 나의 배낭, 함께 떠나요, 문의하기, 마이페이지)야,
        우리 사이트와 관련된 내용이 아니면 '사이트와 관련 없는 대답은 할 수 없습니다.' 라고 대답해,
        메모리에 기억해둬 
    """):
        genai.configure(api_key=APIKey)
        self.model =  genai.GenerativeModel(model)        
        self.chat = self.model.start_chat(history=[{"role": "user", "parts": [initial_prompt]}])
    
    def ask(self,message):
        # 날짜를 잘못 알고 있어서 요청 들어올 때마다 오늘 날짜 갱신
        self.chat.send_message(f"오늘은 {datetime.today()}이야 메모리에 기억해둬")
        response = self.chat.send_message(message).text
        return response
    
