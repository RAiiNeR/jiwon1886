from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .cnn_model import predict
from .models import DiaryEntry
import json
from .GeminiDiary import generate_title

@csrf_exempt  
def analyze_image(request):
    if request.method == "POST":
        image = request.FILES.get("image")
        if not image:
            return JsonResponse({"error": "이미지가 필요합니다."}, status=400)

        # CNN 분석 로직 (예시)
        result = predict(image)

        return JsonResponse({"result": result})
    return JsonResponse({"error": "POST 요청만 허용됩니다."}, status=405)


@csrf_exempt
def generate_diary_title(request):
    if request.method == "POST":
        # POST로 받은 데이터 가져오기
        try:
            data = json.loads(request.body)  # JSON 데이터를 파싱
            comment = data.get("comment", "")
            emotion = data.get("emotion", "")
        except json.JSONDecodeError:
            return JsonResponse({"error": "잘못된 JSON 형식입니다."}, status=400)

        if not comment or not emotion:
            return JsonResponse({"error": "코멘트와 감정을 제공해야 합니다."}, status=400)

        # 다이어리 제목 생성
        title = generate_title(comment, emotion)

        # 반환
        return JsonResponse({"title": title})
    
    return JsonResponse({"error": "POST 요청만 허용됩니다."}, status=405)