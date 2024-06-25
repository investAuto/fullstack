import os
from datetime import timedelta
from pathlib import Path

from django.core.management.utils import get_random_secret_key
from dotenv import load_dotenv

load_dotenv()

NUMBER_OF_SERVICES_FOR_CLIENT = 5
NUMBER_OF_SERVICES_FOR_ADMIN = 10

PHONE_MAX_LENGTH = 12
NAME_MAX_LENGTH = 150
NOTIFICATION_LENGTH = 22
EMAIL_MAX_LENGHT = 254
PASSWORD_MAX_LENGTH = 150
ROLE_LENGTH = 16

MAX_DAYS_REPRODICITY = 60
MIN_DAYS_REPRODICITY = 1
SERVICE_NAME_LENGTH = 254

CAR_NAME_MAX_LENGTH = 20
CAR_YEAR_MAX_LENGTH = 4
GAS_MAX_LENGTH = 16
MAX_PRICE = 10000000
MIN_PRICE = 100000
MAX_DAILY_RENT = 100000
MIN_DAILY_RENT = 1000
MAX_YEAR = 2050
MIN_YEAR = 1900
SHORT_DESCRIPTION_LENGTH = 256
LICENSE_PLATE_LENGTH = 8
VIN_LENGTH = 17
PTS_LENGTH = 17
STS_LENGTH = 17
STATUS_LENGTH = 17


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', get_random_secret_key())

DEBUG = os.getenv('DEBUG', '').lower() == 'true'

# ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost 127.0.0.1').split()
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # # NOTE corsheaders для обработки запросов с фронта
    'corsheaders',
    'rest_framework',
    'colorfield',
    'djoser',

    'users.apps.UsersConfig',
    'car.apps.CarConfig',
    'car_rent_invest.apps.CarRentInvestConfig',
    'api.apps.ApiConfig',
    'notifications.apps.NotificationsConfig'
]

MIDDLEWARE = [
    # # NOTE corsheaders для обработки запросов с фронта
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'invest_auto.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'invest_auto.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'users.CustomUser'

""" Language code English 'en-us'
    Language code Russian 'ru-RU'"""
LANGUAGE_CODE = 'ru-RU'

""" Time zone English 'UTC'
    Time zone Russian 'Europe/Moscow'"""

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True


DJOSER = {
    'LOGIN_FIELD': 'phone',
    'PERMISSIONS': {
        'user_list': ['api.permissions.IsAuthenticatedOrAdminOrMechanic'],
    },
    'SERIALIZERS': {
        'users': 'users.serializers.CustomUserSerializer',
        'current_user': 'users.serializers.CustomUserSerializer',
    }
}

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 5,
}

SIMPLE_JWT = {
    # NOTE ACCESS_TOKEN_LIFETIME 30 дней временное решение на время разработки
    'ACCESS_TOKEN_LIFETIME': timedelta(days=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', '')
EMAIL_PORT = os.getenv('EMAIL_PORT', '')
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', '').lower() == 'true'
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', '').lower() == 'true'

STATIC_URL = "/staticfiles/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = (os.path.join(BASE_DIR, "static"),)

# NOTE Возможно это только в разработке
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',  # Замените на URL фронтенда
]
CORS_URLS_REGEX = r'^/api/.*$'

CELERY_BROKER_URL = os.environ.get("CELERY_BROKER", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_BROKER", "redis://redis:6379/0")

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
