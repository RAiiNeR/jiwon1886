from django.urls import path
from .views import upload_log
from .views import generate_wordcloud_api

urlpatterns = [
    path("upload", upload_log, name="upload_log"),
    path("api", generate_wordcloud_api, name="generate_wordcloud_api"),
]
