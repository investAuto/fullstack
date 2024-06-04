from django.db import models


class Notification(models.Model):
    'Фото связанное с конкретным техническим обслуживание автомобиля'
    name = models.CharField(
        'Название уведомления', max_length=15
    )
