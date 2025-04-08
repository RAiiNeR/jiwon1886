from django.db import models

class Review(models.Model):
    user_name = models.CharField(max_length=100)
    rating = models.FloatField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    sentiment = models.CharField(max_length=10, choices=[("긍정", "긍정"), ("부정", "부정")], default="중립")  # ✅ 감정 분석 결과 저장 필드 추가

    def __str__(self):
        return f"{self.user_name}: {self.sentiment}"
