# Generated by Django 4.2 on 2024-05-17 12:11

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('car', '0028_remove_cartechnicalservice_unique_car_and_technical_service_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='technicalservice',
            name='periodicity',
            field=models.PositiveSmallIntegerField(null=True, validators=[django.core.validators.MaxValueValidator(1), django.core.validators.MinValueValidator(60)], verbose_name='Периодичность обслуживания'),
        ),
    ]
