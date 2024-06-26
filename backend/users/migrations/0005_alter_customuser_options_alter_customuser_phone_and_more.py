# Generated by Django 4.2 on 2024-05-08 07:18

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_customuser_password_alter_customuser_phone'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='customuser',
            options={'default_related_name': 'users', 'ordering': ('username',), 'verbose_name': 'Пользователь', 'verbose_name_plural': 'Пользователи'},
        ),
        migrations.AlterField(
            model_name='customuser',
            name='phone',
            field=models.CharField(max_length=12, unique=True, validators=[django.core.validators.RegexValidator('^((+7|7|8)+([0-9]){10})$', 'Номер должен начинаться с 7, +7, 8 и содержать после этого 10 цифр.')], verbose_name='Номер телефона'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(choices=[('ADMIN', 'admin'), ('CLIENT', 'client')], default='CLIENT', max_length=16, verbose_name='Роль пользователя'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='username',
            field=models.CharField(blank=True, max_length=150, null=True, unique=True, validators=[django.core.validators.RegexValidator('^[\\w.@+-]+\\Z', 'Вы не можете зарегестрировать пользователя с таким именем.'), django.core.validators.RegexValidator('^me$', 'Вы не можете зарегестрировать пользователя с таким именем.', inverse_match=True)], verbose_name='Ник-нейм пользователя'),
        ),
    ]
