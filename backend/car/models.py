from colorfield.fields import ColorField
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.dispatch import receiver

User = get_user_model()


class TechnicalService(models.Model):
    '''Модель технического обслуживания'''

    name = models.CharField(
        'Название обслуживания',
        max_length=settings.SERVICE_NAME_LENGTH,
        unique=True
    )
    description = models.TextField('Описание')
    periodicity = models.PositiveSmallIntegerField(
        'Периодичность обслуживания, дней',
        null=True,
        blank=True,
        validators=[
            MaxValueValidator(settings.MAX_DAYS_REPRODICITY),
            MinValueValidator(settings.MIN_DAYS_REPRODICITY)
        ])

    class Meta:
        verbose_name = 'Oбслуживание'
        verbose_name_plural = 'Oбслуживания'
        default_related_name = 'technical_services'

    def __str__(self):
        return self.name


class Car(models.Model):
    '''Модель автомобиля'''

    class Gas(models.TextChoices):
        '''Какое топливо используется в автомобиле.'''

        GAS = 'GAS', 'газ'
        GASOLINE = 'GASOLINE', 'бензин'

    class Status(models.TextChoices):
        '''Какой статус используется в автомобиле.'''
        TS = 'TECHNICAL_SERVICE', 'техобслуживание'
        REPAIR = 'REPAIR', 'на ремонте'
        WORK = 'WORK', 'работает'
        ON_PARKING = 'ON_PARKING', 'на стоянке'

    name = models.CharField(
        'Название автомобиля', max_length=settings.CAR_NAME_MAX_LENGTH
    )
    color = ColorField(
        'Цвет', default='#000000'
    )
    description = models.TextField('Описание')
    technical_characteristic = models.TextField(
        'Технические характеристики', blank=True
    )
    short_description = models.CharField(
        'Короткое описание на главной',
        null=True,
        max_length=settings.SHORT_DESCRIPTION_LENGTH
    )
    year_release = models.PositiveSmallIntegerField(
        'Год выпуска',
        validators=[
            MaxValueValidator(settings.MAX_YEAR),
            MinValueValidator(settings.MIN_YEAR)
        ]
    )
    gas = models.CharField(
        'Топливо',
        max_length=settings.GAS_MAX_LENGTH,
        choices=Gas.choices,
        default=Gas.GAS
    )
    price = models.PositiveIntegerField(
        'Цена',
        null=True,
        validators=[
            MaxValueValidator(settings.MAX_PRICE),
            MinValueValidator(settings.MIN_PRICE)
        ]
    )
    daily_rent = models.PositiveIntegerField(
        'Стоимость аренды в день',
        null=True,
        validators=[
            MaxValueValidator(settings.MAX_DAILY_RENT),
            MinValueValidator(settings.MIN_DAILY_RENT)
        ]
    )
    license_plate = models.CharField(
        'Гос. номер',
        max_length=settings.LICENSE_PLATE_LENGTH,
        unique=True,
        blank=True,
        null=True
    )
    vin = models.CharField(
        'VIN',
        max_length=settings.VIN_LENGTH,
        unique=True,
        null=True,
        blank=True

    )
    pts = models.CharField(
        'ПТС',
        max_length=settings.PTS_LENGTH,
        unique=True,
        null=True,
        blank=True
    )
    sts = models.CharField(
        'СТС',
        max_length=settings.STS_LENGTH,
        unique=True,
        blank=True,
        null=True
    )
    status = models.CharField(
        'Статус машины',
        max_length=settings.STATUS_LENGTH,
        choices=Status.choices,
        default=Status.ON_PARKING
    )

    technical_service = models.ManyToManyField(
        TechnicalService,
        through='CarTechnicalService',
        help_text='Удерживайте Ctrl для выбора нескольких вариантов',
        verbose_name='Обслуживания',
        blank=True
    )

    class Meta:
        ordering = ('name',)
        verbose_name = 'Автомобиль'
        verbose_name_plural = 'Автомобили'
        default_related_name = 'cars'

    def __str__(self):
        return self.name


class CarCard(models.Model):
    car = models.OneToOneField(Car, on_delete=models.CASCADE)
    hide = models.BooleanField(
        'Скрыть карточку из каталога', default=False
    )
    new = models.BooleanField('Бейджик новое', default=False)

    class Meta:
        verbose_name = 'Карточка'
        verbose_name_plural = 'Карточки'
        default_related_name = 'card'


class CarPhoto(models.Model):
    'Фото связанное с конкретным автомобилем'
    photo = models.ImageField('Фото', upload_to='cars/images/', unique=True)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    is_preview = models.BooleanField(default=False)

    class Meta:
        default_related_name = 'photos'


@ receiver(models.signals.pre_delete, sender=CarPhoto)
def car_photo_delete(sender, instance, **kwargs):
    '''Удаляем изображение авто из хранилища при удалении обьекта CarPhoto'''
    instance.photo.delete(False)


class CarVideo(models.Model):
    'Ссылка на видео связанное с конкретным автомобилем'
    video = models.URLField('Видео', null=True, blank=True, unique=True)
    car = models.ForeignKey(
        Car, on_delete=models.CASCADE
    )

    class Meta:
        default_related_name = 'videos'


class CarTechnicalService(models.Model):
    'Техническое обслуживание связанное с конкретным автомобилем'
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name='Автор'
    )
    car = models.ForeignKey(
        Car, on_delete=models.CASCADE, null=True, verbose_name='Автомобиль')
    technical_service = models.ForeignKey(
        TechnicalService,
        on_delete=models.CASCADE,
        verbose_name='Техническое обслуживание.'
    )
    date_service = models.DateField(
        'Дата выполнения', null=True)
    scheduled_date = models.DateField(
        'Запланированная дата'
    )
    comment = models.TextField(
        'Комментарий к обслуживанию.', blank=True, default='Без комментариев.'
    )

    class Meta:
        ordering = ('-date_service',)
        verbose_name = 'Техническое обслуживание'
        verbose_name_plural = 'Технические обслуживания'
        default_related_name = 'car_technical_services'
        constraints = [
            models.UniqueConstraint(
                fields=('car', 'technical_service', 'scheduled_date'),
                name='unique_car_and_technical_service_and_date_service'
            )
        ]

    def __str__(self):
        return f'{self.technical_service} автомобиля {self.car}'


class TechnicalServicePhoto(models.Model):
    '''Фото связанное с конкретным техническим обслуживание автомобиля'''
    photo = models.ImageField(
        'Фото', upload_to='technical_services/images/', unique=True)
    service = models.ForeignKey(
        CarTechnicalService, on_delete=models.CASCADE, related_name='photos')

    class Meta:
        default_related_name = 'services_photos'


@receiver(models.signals.pre_delete, sender=TechnicalServicePhoto)
def technical_photo_delete(sender, instance, **kwargs):
    '''Удаляем изображение авто из хранилища
    при удалении обьекта TechnicalServicePhoto'''
    instance.photo.delete(False)
