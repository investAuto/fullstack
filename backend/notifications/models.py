from django.db import models


class Notification(models.Model):
    'Фото связанное с конкретным техническим обслуживание автомобиля'
    name = models.CharField(
        'Название уведомления', max_length=15
    )

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'
        db_table = 'notifications'

    def __str__(self):
        return f'{self.name}'
