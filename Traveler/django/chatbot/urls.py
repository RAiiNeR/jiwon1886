from django.urls import path
from chatbot import views

urlpatterns = [
    path('log',views.getLogged),
    path('ask',views.ask),
]
