from django.urls import path
from facecam import views

urlpatterns = [
    # path('video_feed',views.video_feed, name='video_feed'),
    path('facecam',views.facecam, name='facecam'),
]
