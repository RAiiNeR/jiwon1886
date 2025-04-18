# Generated by Django 5.1.5 on 2025-03-05 06:42
# Generated by Django 5.1.6 on 2025-03-06 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="DiaryEntry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("location", models.CharField(max_length=255)),
                ("comment", models.TextField()),
                ("emotion", models.CharField(max_length=50)),
                (
                    "generated_title",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UploadedImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image", models.ImageField(upload_to="uploads/")),
                ("uploaded_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
