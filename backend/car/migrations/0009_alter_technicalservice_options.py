# Generated by Django 3.2.16 on 2024-05-08 11:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('car', '0008_auto_20240508_1404'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='technicalservice',
            options={'default_related_name': 'technical_service', 'verbose_name': 'Техническое обслуживание.', 'verbose_name_plural': 'Технические обслуживания'},
        ),
    ]
