from django.db import models

# Create your models here.

class UploadedImage(models.Model):
    image = models.ImageField(upload_to="uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
class DiaryEntry(models.Model):
    location = models.CharField(max_length=255)
    comment = models.TextField()
    emotion = models.CharField(max_length=50)
    generated_title = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.generated_title or "Untitled Entry"