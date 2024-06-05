from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from car.models import Car

User = get_user_model()


class UserRent(models.Model):
    '''Модель аренды связанная с пользователем.'''
    car = models.ForeignKey(
        Car,
        verbose_name='Машина',
        on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, verbose_name='Арендатор', on_delete=models.CASCADE
    )

    start_rent = models.DateField('Начало аренды')
    end_rent = models.DateField('До какого числа аренда.')
    distance = models.PositiveIntegerField(
        'Пройденое расстояние(км)',
        default=1,
        validators=[
            MaxValueValidator(300000),
            MinValueValidator(1)
        ]
    )
    complited = models.BooleanField('Аренда завершена', default=False)

    def clean(self):
        ''' Проверка на наличие пересечения дат аренды
        с уже имеющимися или друг с другом'''
        overlapping_rents = UserRent.objects.filter(
            car=self.car,
            start_rent__lt=self.end_rent,
            end_rent__gt=self.start_rent
        ).exclude(id=self.id)

        if self.start_rent >= self.end_rent:
            raise ValidationError(
                'Окончание аренды должно быть позже начала оренды.'
            )

        if overlapping_rents.exists():
            raise ValidationError(
                'В указанный период автомобиль арендован '
                'или аренда уже запланирована.'
            )

    class Meta:
        verbose_name = 'Аренда'
        verbose_name_plural = 'Аренды'
        default_related_name = 'user_rent'
        db_table = 'user_rent'

    def __str__(self):
        return (
            f'Арендатор {self.user.fullname}:'
            f' арендованый автомобиль {self.car.name}.'
        )


''' Модели инвестиций в данный момент не используются
и могут пригодиться в будущем поэтому пока удалять их не буду'''
# class Investment(models.Model):
#     '''Основная модель аренды инвестиции.'''
#     MAX_RATE = 100
#     MIN_RATE = 15

#     car = models.ForeignKey(
#         Car, verbose_name='Инвестиция', on_delete=models.CASCADE
#     )
#     tracking_link = models.URLField(
#         'Отслеживание местоположения автомобиля', unique=True)
#     interest_rate = models.PositiveSmallIntegerField(
#         'Процентная ставка',
#         validators=[
#             MaxValueValidator(MAX_RATE),
#             MinValueValidator(MIN_RATE)
#         ]
#     )
#     currency = models.CharField('Валюта', max_length=3, default='₽')
# class UserInvestment(models.Model):
#     '''Модель инвестиции связанная с пользователем'''
#     MIN_SUM_INVESTMENT = 100000

#     investment = models.ForeignKey(
#         Investment, verbose_name='Инвестиция', on_delete=models.CASCADE)
#     user = models.ForeignKey(
#         User, verbose_name='Инвестор', on_delete=models.CASCADE)
#     date_from = models.DateField('Начало инвестирования.')
#     date_to = models.DateField('До какого числа инверстировал.')
#     sum = models.PositiveIntegerField(
#         'Вложенная сумма',
#         validators=[
#             MinValueValidator(MIN_SUM_INVESTMENT)
#         ]
#     )

#     class Meta:
#         verbose_name = 'Инвестиция'
#         verbose_name_plural = 'Инвестиции'
#         default_related_name = 'user_investment'
#         db_table = 'user_investment'

#     def __str__(self):
#         return f'Инвестор {self.user.username} {self.investment.car.name}.'
