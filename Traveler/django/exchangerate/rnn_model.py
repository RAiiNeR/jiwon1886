from django.http import JsonResponse
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import os
import logging
import pandas as pd

# 로깅 설정
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "exchangerate", "Model.keras")

# ✅ LSTM 모델 로드
if os.path.exists(model_path):
    model = tf.keras.models.load_model(model_path)
    print(f"✅ 모델 로드 성공: {model_path}")
else:
    raise FileNotFoundError(f"❌ 모델 파일을 찾을 수 없습니다: {model_path}")

# ✅ StandardScaler 초기화 (scaler.pkl 없이 직접 설정)
scaler = StandardScaler()
mean_values = np.array([1, 1400, 0.02, 1450, 0, 1420, 1415, 0])  # (8,)
std_values = np.array([1, 200, 0.01, 100, 0.01, 50, 50, 10])  # (8,)

scaler.mean_ = mean_values
scaler.scale_ = std_values

# ✅ 통화 코드 변환 (숫자로 변환된 값 사용)
currency_mapping = {
    'USD': 0,
    'EUR': 1,
    'JPY': 2,
    'CNY': 3
}

# ✅ 예제 데이터 (실제 데이터베이스 연동 필요)
df = pd.DataFrame({
    '통화': ['USD', 'EUR', 'JPY', 'CNY'],
    '평균가격': [1450.5, 1500.6, 850.2, 188.4],
    '등락폭': [0.02, 0.03, 0.02, 0.01],
    '현재가격': [1485.7, 1520.4, 880.4, 190.2],
    '변동률': [0.01, 0.02, 0.015, 0.005],
    '5일_이동평균': [1470.0, 1510.0, 870.0, 189.3],
    '10일_이동평균': [1465.0, 1508.7, 875.5, 188.9],
    '전일_차이': [-4.5, 5.6, -2.2, -0.3]
})

def get_prediction(currency, is_local=True):
    try:
        if currency not in currency_mapping:
            return {"error": f"{currency} 데이터 없음"}

        # ✅ 예측에 필요한 8개 특징 선택
        features = ['통화', '평균가격', '등락폭', '현재가격', '변동률', '5일_이동평균', '10일_이동평균', '전일_차이']

        # ✅ 최근 10일 데이터 생성 (실제 데이터 연동 필요)
        sequence_length = 10
        sample_data = df[df['통화'] == currency][features].iloc[0]  # (8,)
        sample_values = np.array([sample_data.tolist()] * sequence_length)  # (10, 8)

        print(f"🔹 sample_values.shape: {sample_values.shape}")  # ✅ (10, 8)인지 확인

        # ✅ '통화'를 숫자로 변환하여 포함
        sample_values[:, 0] = currency_mapping[currency]  # 통화 코드 숫자로 변경

        # ✅ 스케일링 적용 (fit 없이 transform만 수행)
        sample_scaled = scaler.transform(sample_values)  # (10, 8)

        # ✅ 3D 차원 변환 (LSTM 입력 형식)
        sample_scaled = np.expand_dims(sample_scaled, axis=0)  # (1, 10, 8)

        # ✅ 예측 수행
        y_pred = model.predict(sample_scaled)

        # ✅ 이진 분류 변환
        y_pred_class = (y_pred > 0.5).astype(int)

        # ✅ 결과 변환
        result = "구매 추천" if y_pred_class[0][0] == 1 else "구매 비추천"
        return {currency: result}

    except Exception as e:
        logger.error(f"예측 오류: {str(e)}")
        return {"error": "서버 오류 발생"}


def predict_exchange_rate(request):
    """
    Django API 엔드포인트: 환율 예측을 수행
    """
    try:
        # ✅ request에서 'currency' 값을 가져올 때 strip()과 upper() 적용
        currency = request.GET.get("currency", "USD").strip().upper()

        # ✅ 유효한 통화 코드인지 확인
        if currency not in currency_mapping:
            return JsonResponse({"error": "유효하지 않은 통화 코드"}, status=400)

        # ✅ 'is_local' 파라미터 처리 (기본값=True)
        is_local_str = request.GET.get("is_local", "true").lower()
        is_local = is_local_str == "true"

        # ✅ get_prediction() 호출 (is_local 추가)
        prediction_result = get_prediction(currency, is_local)

        return JsonResponse(prediction_result)
    
    except Exception as e:
        logger.error(f"API 호출 오류: {str(e)}")
        return JsonResponse({"error": "서버 내부 오류"}, status=500)
