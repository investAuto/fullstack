from email.header import Header

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from car.models import CarTechnicalService


@ shared_task
def create_emails():
    # TODO как декомпозировать эту функцию
    '''Создаёт и отправляет сообщение на почту sms target'''
    # формат отправки сообщения Login;psw;sender;phone;mes
    # Login - в API рассылке берём из окружения
    # psw - в API рассылке берём из окружения
    # sender - в API рассылке берём из окружения
    # phone - номер владельца берём из базы

    # получить из базы все модели
    # в цикле сформировать строчки сообщения
    # поместить сообщение для отправки
    services = CarTechnicalService.objects.filter(
        date_service=None).order_by('author__phone')

    phone_numbers = services.values_list('author__phone', flat=True).distinct()
    login = 'Логин'
    psw = 'пароль'
    sender = 'имя'
    text_message = ''
    message = ''

    def create_text_message(athor_phone_number: str) -> str:
        '''Принимает номер телефона автора сервиса,
        создаём текст одного сообщения на основе '''
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

    for phone_number in phone_numbers:
        text_message = (
            'Напоминаем вам что, ' + create_text_message(phone_number)
            )
        message = (
            message + f'{login};{psw};{sender};{phone_number};{text_message}\n'
            )
    send_mail(
        subject=Header('Техническое обслуживание', 'utf-8'),
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=['invest_auto@inbox.ru'],
        fail_silently=True,
    )
    return 'Это сообщение из tasks'
