from django.http import JsonResponse
from .rnn_model import get_prediction
from django.views.decorators.csrf import csrf_exempt
import logging

# 로깅 설정
logger = logging.getLogger(__name__)

@csrf_exempt
def predict_exchange_rate(request):
    if request.method == "GET":
        # 'currency' 파라미터 유효성 검사
        currency = request.GET.get("currency", "USD")  # 기본값 USD
        valid_currencies = ['USD', 'EUR', 'JPY', 'CNY']  # 유효한 통화 코드 리스트
        if currency not in valid_currencies:
            logger.warning(f"유효하지 않은 통화 코드 요청: {currency}")
            return JsonResponse({"error": "유효하지 않은 통화 코드입니다."}, status=400)

        # 'is_local' 파라미터 처리
        is_local_str = request.GET.get("is_local", "true").lower()
        if is_local_str not in ['true', 'false']:
            logger.warning(f"잘못된 is_local 값 요청: {is_local_str}")
            return JsonResponse({"error": "is_local 값은 'true' 또는 'false'만 가능합니다."}, status=400)
        
        is_local = is_local_str == "true"

        # 예측 실행
        try:
            prediction = get_prediction(currency, is_local)
            if not prediction:
                logger.error(f"{currency}에 대한 예측 실패.")
                return JsonResponse({"error": "예측 실패, 다시 시도해 주세요."}, status=500)

            # 예측 결과 반환
            logger.info(f"{currency} 예측 결과: {prediction}")
            return JsonResponse({"recommendation": prediction})

        except Exception as e:
            logger.error(f"예측 중 오류 발생: {e}")
            return JsonResponse({"error": "예측 처리 중 오류가 발생했습니다."}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
