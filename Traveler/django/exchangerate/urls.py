from django.urls import path
from .views import predict_exchange_rate

urlpatterns = [
    path('exchangerate/', predict_exchange_rate, name='predict_exchange_rate'),
]
