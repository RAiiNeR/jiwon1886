from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .dnn_model import predict_sentiment  # 👈 감정 분석 모델 불러오기
from .models import Review

import cx_Oracle  # ✅ Oracle DB 연결을 위한 라이브러리
import datetime



print("analyze_sentiment 로드 완료")

@csrf_exempt
def analyze_sentiment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            text = data.get("text", "")

            if not text:
                return JsonResponse({"error": "텍스트가 필요합니다."}, status=400)

            result = predict_sentiment(text)  # 👈 감정 분석 실행
            return JsonResponse({"sentiment": result})

        except json.JSONDecodeError:
            return JsonResponse({"error": "잘못된 JSON 데이터"}, status=400)

    return JsonResponse({"error": "POST 요청만 허용됩니다."}, status=405)


# ✅ Oracle DB 연결 설정
dsn_tns = cx_Oracle.makedsn('34.47.113.40', 1521, service_name='free')  # DB 설정에 맞게 변경
conn = cx_Oracle.connect(user='traveler', password='traveler', dsn=dsn_tns)

@csrf_exempt
def add_review(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_name = data.get("user_name", "")
            rating = data.get("rating", 0)
            content = data.get("content", "")
            tour_num = data.get("tourNum", 0)
            if not user_name or not content:
                return JsonResponse({"error": "유저 이름과 리뷰 내용이 필요합니다."}, status=400)
            # ✅ 감정 분석 수행
            sentiment_result = predict_sentiment(content)
            # ✅ Oracle에서 REVIEW_ID 시퀀스 값을 가져옴
            with conn.cursor() as cursor:
                cursor.execute("SELECT TOUR_REVIEW_SEQ.NEXTVAL FROM DUAL")
                review_id = cursor.fetchone()[0]  # ✅ 새로운 REVIEW_ID 가져오기
                # ✅ Oracle DB에 저장
                sql = """
                INSERT INTO TOUR_REVIEW (REVIEW_ID, USER_NAME, RATING, CONTENT, TOUR_NUM, SENTIMENT, CREATED_AT) 
                VALUES (:1, :2, :3, :4, :5, :6, SYSDATE)
                """
                cursor.execute(sql, (review_id, user_name, rating, content, tour_num, sentiment_result))
                conn.commit()

            response_data = {
                "id": review_id,
                "user_name": user_name,
                "rating": rating,
                "content": content,
                "sentiment": sentiment_result
            }
            return JsonResponse(response_data, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "잘못된 JSON 데이터"}, status=400)

    return JsonResponse({"error": "POST 요청만 허용됩니다."}, status=405)

@csrf_exempt
def get_reviews(request):
    if request.method == "GET":
        reviews = Review.objects.all().order_by("-created_at")  # 최신순 정렬

        review_list = [
            {
                "user_name": review.user_name,
                "rating": review.rating,
                "content": review.content,
                "created_at": review.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "sentiment": review.sentiment,  # ✅ 감정 분석 결과 포함
            }
            for review in reviews
        ]

        return JsonResponse({"reviews": review_list})

    return JsonResponse({"error": "GET 요청만 허용됩니다."}, status=405)
