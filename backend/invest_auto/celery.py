import os

from celery import Celery

# from celery.schedules import crontab
# from email.header import Header
# import time
# from django.conf import settings
# from django.core.mail import send_mail
# from celery import shared_task

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "invest_auto.settings")
app = Celery("invest_auto")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# TODO Это для работы с периодическими задачами потом нужно будет разобраться
# CELERY_BEAT_SCHEDULE = {
#     'add-every-30-seconds': {
#         'task': 'tasks.create_emails',
#         'schedule': crontab(),
#         'args': (16, 16)
#     },
# }


# @app.task
# def create_emails():
#     time.sleep(10)
#     send_mail(
#         subject=Header('Тема на русском', 'utf-8'),
#         message='Андрей пытался опубликовать запись!',
#         from_email=settings.EMAIL_HOST_USER,
#         recipient_list=['invest_auto@inbox.ru'],
#         fail_silently=True,
#     )
#     return 1+1
