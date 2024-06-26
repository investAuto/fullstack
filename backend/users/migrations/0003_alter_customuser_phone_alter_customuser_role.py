# Generated by Django 4.2 on 2024-05-07 06:26

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_customuser_email_alter_customuser_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='phone',
            field=models.CharField(max_length=18, unique=True, validators=[django.core.validators.RegexValidator('^((+7|7|8)+([0-9]){10})$', 'Номер должен начинаться с 7, +7, 8 и содержать после этого 10 цифр.')], verbose_name='Телефон'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(choices=[('ADMIN', 'admin'), ('CLIENT', 'client')], default='CLIENT', max_length=16),
        ),
    ]
