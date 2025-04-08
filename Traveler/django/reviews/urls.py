from django.urls import path
from .views import analyze_sentiment  # 👈 views.py에서 함수 가져오기
from .views import add_review
from .views import get_reviews


urlpatterns = [
    path("analyze-sentiment/", analyze_sentiment, name="analyze_sentiment"),
    path("add-review/", add_review, name="add_review"),
    path("get-reviews/", get_reviews, name="get_reviews"),
]
