
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator
from django.db import models


class UserAccountManager(BaseUserManager):
    def create_user(self, phone, fullname, password=None):
        user = self.model(
            phone=phone,
            fullname=fullname
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, fullname, password):
        user = self.create_user(
            phone=phone,
            fullname=fullname,
            password=password
        )
        user.is_staff = True
        user.role = CustomUser.Role.ADMIN
        user.save(using=self._db)
        return user


class CustomUser(AbstractUser):
    '''Модель кастомного пользователя'''
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'администратор'
        CLIENT = 'CLIENT', 'пользователь'
        MECHANIC = 'MECHANIC', 'механик'

    class Notification(models.TextChoices):
        SMS = 'SMS', 'смс'
        TELEGRAM = 'TELEGRAM', 'телеграм'
        WHATSAPP = 'WHATSAPP', 'ватсап'
        WITHOUT_NOTIFICATIONS = 'WITHOUT_NOTIFICATIONS', 'без уведомлений'

    role = models.CharField(
        'Роль пользователя',
        max_length=settings.ROLE_LENGTH,
        choices=Role.choices,
        default=Role.CLIENT
    )
    email = models.EmailField(
        'Электронная почта',
        max_length=settings.EMAIL_MAX_LENGHT,
        null=True,
        blank=True
    )
    phone = models.CharField(
        'Номер телефона',
        max_length=settings.PHONE_MAX_LENGTH,
        unique=True,
        validators=[
            RegexValidator(
                r'^((\+7|7|8)+([0-9]){10})$',
                'Номер должен начинаться с 7, +7, 8'
                ' и содержать после этого 10 цифр.'
            )]
    )
    notification = models.CharField(
        'Уведомления',
        max_length=settings.NOTIFICATION_LENGTH,
        choices=Notification.choices,
        default=Notification.SMS
    )
    username = models.CharField(
        'Ник-нейм пользователя',
        max_length=settings.NAME_MAX_LENGTH,
        null=True,
        blank=True,
        unique=True,
        validators=[
            RegexValidator(
                r'^[\w.@+-]+\Z',
                'Вы не можете зарегестрировать пользователя с таким именем.'
            ),
            RegexValidator(
                '^me$',
                'Вы не можете зарегестрировать пользователя с таким именем.',
                inverse_match=True
            ),
        ]
    )
    fullname = models.CharField(
        # TODO Добавить валидацию для полного имени
        'Имя, Фамилия, Отчество',
        max_length=settings.NAME_MAX_LENGTH,
        validators=[
            RegexValidator(
                r'^[А-ЯЁ][а-яё]*\s+[А-ЯЁ][а-яё]*(\s+[А-ЯЁ][а-яё]*)*$',
                'Должно быть минимум имя и фамилия и'
                ' они должны начинаться с большой буквы.'
                ' Используйте кириллические символы.'
            )]
    )
    password = models.CharField(
        'Пароль', max_length=settings.PASSWORD_MAX_LENGTH)
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['fullname']
    objects = UserAccountManager()

    class Meta:
        ordering = ('username',)
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        default_related_name = 'users'

    def __str__(self):
        return self.fullname

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN or self.is_superuser

    @property
    def is_client(self):
        return self.role == self.Role.CLIENT

    @property
    def is_mechanic(self):
        return self.role == self.Role.MECHANIC
