from django.shortcuts import render,redirect
from django.views.decorators.csrf import csrf_exempt

from chatbot.mod import OpenAIKeys
from chatbot.GeminiChat import GeminiChat
# json을 가공하기 위한 모듈
import json
# RestAPI를 사용해서 json으로 응답 객체를 생성하기 위한 모듈
# Spring의 @RestController, @ResponseBody 역할
from django.http import JsonResponse

APIKey = OpenAIKeys()
chat = GeminiChat(APIKey)

# Create your views here.
def getLogged(request):
    log = chat.logged()
    return JsonResponse({'log':log})

@csrf_exempt
def ask(request):
    try:
        data = json.loads(request.body)  # JSON 요청 데이터 파싱
        message = data.get("message", "")  # 'message' 키 가져오기
        answer = chat.ask(message)
        return JsonResponse({'answer': answer})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)