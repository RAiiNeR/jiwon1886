from django.urls import path
from .views import analyze_image
from .views import generate_diary_title

urlpatterns = [
    path("cnn-analyze", analyze_image, name="cnn_analyze"),
    path("generate-title", generate_diary_title, name="generate_title"),
]
