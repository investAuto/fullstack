# Generated by Django 4.2 on 2024-05-16 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('car_rent_invest', '0015_rename_date_to_userrent_end_rent_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userrent',
            name='complited',
            field=models.BooleanField(default=False, verbose_name='Аренда завершена'),
        ),
    ]
