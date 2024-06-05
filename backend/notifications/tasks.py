import os
from email.header import Header

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.db import models

from car.models import CarTechnicalService


def _create_text_message(
    athor_phone_number: str, services: models.QuerySet[CarTechnicalService]
) -> str:
    '''Принимает номер телефона автора сервиса, и список незавершённых сервисов
    владельца телефона, создаём текст одного сообщения на основе '''
    text_message = ''
    current_services = services.filter(
        author__phone=athor_phone_number
    )
    for service in current_services:
        text_message = (
            f'{text_message}'
            f'{service.scheduled_date} необходимо выполнить обслуживание'
            f' {service.technical_service.name}. '
        )
    return text_message[:-1]


def _create_text_email() -> str:
    '''Находит все запланированные сервисы у которых нет даты создания,
    выбирает список номеров телефоно авторов
    которые должны обновить эти сервисы. На основе этого создаёт текст email
    который должен быть отправлени в sms target'''
    services = CarTechnicalService.objects.filter(
        date_service=None
    ).order_by('author__phone')

    phone_numbers = services.values_list('author__phone', flat=True).distinct()
    login = os.getenv('EMAIL_TARGET_LOGIN') or 'логин'
    psw = os.getenv('EMAIL_TARGET_PSW') or 'пароль'
    sender = os.getenv('EMAIL_TARGET_SENDER') or 'имя_отправителя'
    text_message = ''
    message = ''
    '''Принимает список номеров и сервисов, возвращает текст всего email'''
    for phone_number in phone_numbers:
        text_message = 'Напоминаем вам что, {}'.format(
            _create_text_message(phone_number, services)
        )
        message = (
            message + f'{login};{psw};{sender};{phone_number};{text_message}\n'
        )
    return message


@ shared_task
def create_send_email() -> str:
    '''Отправляет сообщение на почту sms target'''
    send_mail(
        subject=Header('Техническое обслуживание', 'utf-8'),
        message=_create_text_email(),
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[os.getenv('EMAIL_TARGET_RECIPIENT', '')],
        fail_silently=True,
    )
    return 'Email отправлен'
