# Generated by Django 4.2 on 2024-06-06 07:27

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_alter_customuser_fullname'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='fullname',
            field=models.CharField(help_text='Должно быть минимум имя и фамилия.', max_length=150, validators=[django.core.validators.RegexValidator('^[А-ЯЁ][а-яё]*\\s+[А-ЯЁ][а-яё]*(\\s+[А-ЯЁ][а-яё]*)*$', 'Должно быть минимум имя и фамилия и они должны начинаться с большой буквы. Используйте кириллические символы.')], verbose_name='Имя, Фамилия, Отчество'),
        ),
    ]
