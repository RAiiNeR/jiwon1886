import torch
from transformers import BertForSequenceClassification, AutoTokenizer
import os

os.environ["MECAB_PATH"] = r"C:\Users\ICT-27\Downloads\mecab-ko-msvc-x64\mecab.exe"
# ✅ 모델 파일 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "trained_model.pth")  # 모델 파일명 주의!

# ✅ BERT 모델 불러오기
model_name = "cl-tohoku/bert-base-japanese"  # Jupyter에서 사용한 BERT 모델과 동일해야 함!
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = BertForSequenceClassification.from_pretrained(model_name, num_labels=2)  # 긍정/부정 2개 클래스

# ✅ 모델 가중치 불러오기
if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
    model.eval()
    print(f"✅ BERT 모델 로드 성공: {model_path}")
else:
    raise FileNotFoundError(f"❌ 모델 파일을 찾을 수 없습니다: {model_path}")

# ✅ 감정 분석 함수
def predict_sentiment(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()
    label_mapping = {0: "부정", 1: "긍정"}
    return label_mapping[predicted_class]

# ✅ 테스트 실행 코드
if __name__ == "__main__":
    test_text = "この旅行は最高でした！"
    result = predict_sentiment(test_text)
    print(f"📝 테스트 문장: {test_text}")
    print(f"🎯 예측된 감정: {result}")  