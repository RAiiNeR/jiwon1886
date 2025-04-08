from django.db import models

class ExchangeRate(models.Model):
    date = models.DateField()
    currency = models.CharField(max_length=4)
    rate = models.FloatField()

    class Meta:
        unique_together = ('date', 'currency')  # 같은 날짜 + 통화 조합 중복 방지

    def __str__(self):
        return f"{self.currency} - {self.date}: {self.rate}"

