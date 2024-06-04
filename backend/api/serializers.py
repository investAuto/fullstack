from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.db import transaction
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from car.models import (
    Car,
    CarPhoto,
    CarTechnicalService,
    CarVideo,
    TechnicalService,
    TechnicalServicePhoto
)
from car_rent_invest.models import UserRent

User = get_user_model()


class CarPhotoSerializer(serializers.ModelSerializer):
    '''Для вывода нескольких фото.'''
    class Meta:
        model = CarPhoto
        fields = ('photo', 'car')


class CarVideoSerializer(serializers.ModelSerializer):
    '''Для вывода нескольких видео.'''
    class Meta:
        model = CarVideo
        fields = ('video', 'car')


class CarTechnicalServicePhotoSerializer(serializers.ModelSerializer):
    '''Для работы с фотограффиями технического обслуживания.'''
    photo = Base64ImageField(required=True)

    class Meta:
        model = TechnicalServicePhoto
        fields = ('id', 'photo',)


class CreateCarTechnicalServiceSerializer(serializers.ModelSerializer):
    '''Для создания и изменения технического обслуживания
    связанного с автомобилем.
    '''
    service = serializers.CharField(source='technical_service.name')
    car = serializers.CharField(source='car.name')
    # cats = serializers.StringRelatedField(many=True, read_only=True)
    photos = CarTechnicalServicePhotoSerializer(many=True)

    def create_new_service(self, author, service, car, comment):

        return CarTechnicalService.objects.create(
            author=author,
            technical_service=service,
            scheduled_date=date.today() + timedelta(days=service.periodicity),
            comment=comment,
            car=car
        )

    @transaction.atomic
    def create(self, validated_data):
        '''Когда пользователь добавляет сервис,
        находим последний невыполненный сервис,
        если мы его не нашли то создаём сервис с текущей датой выполнения,
        если нашли то добавляем ему дату выполнения и ставим статус выполнено,
        после этого создаём запланированный сервис.
        '''
        photos = validated_data.pop('photos')
        service = TechnicalService.objects.get(
            name=validated_data.pop('technical_service').get('name')
        )
        car = Car.objects.get(
            name=validated_data.pop('car').get('name')
        )
        current_service = CarTechnicalService.objects.filter(
            author=self.context.get('request').user,
            technical_service=service,
            date_service=None,
            car=car
        ).last()
        if not current_service:
            current_service = CarTechnicalService.objects.create(
                author=self.context.get('request').user,
                technical_service=service,
                date_service=date.today(),
                scheduled_date=date.today(),
                comment=validated_data.get('comment'),
                car=car
            )
        else:
            current_service.comment = validated_data.get('comment'),
            current_service.complited = True
            current_service.date_service = date.today()
            current_service.save()

        self.create_new_service(
            self.context.get('request').user,
            service,
            car,
            validated_data.get('comment')
        )

        for photo_data in photos:
            TechnicalServicePhoto.objects.create(
                service=current_service, **photo_data
            )
        return current_service

    @transaction.atomic
    def update(self, instance, validated_data):
        validated_data.pop('technical_service')
        validated_data.pop('car')
        photos = validated_data.pop('photos')

        instance.photos.all().delete()

        photos = [
            TechnicalServicePhoto(
                service=instance, **photo_data
            )
            for photo_data in photos
        ]
        photos = TechnicalServicePhoto.objects.bulk_create(photos)

        instance.comment = (
            validated_data.get('comment') or 'Без комментариев!'
        )
        instance.save()
        return super().update(instance, validated_data)

    class Meta:
        model = CarTechnicalService
        fields = (
            'id', 'date_service', 'car', 'service', 'photos', 'comment'
        )

    def validate_car(self, value):
        if not Car.objects.filter(name=value).exists():
            raise serializers.ValidationError(
                'Авто с таким названием не существует'
            )
        return value

    def validate_service(self, value):
        if not TechnicalService.objects.filter(name=value).exists():
            raise serializers.ValidationError(
                'Такого сервиса не существует'
            )
        return value

    def validate_photos(self, value):
        if (
            not len(value)
            or (
                self.instance
                and (self.instance.photos.count() + len(value) > 5)
                or len(value) > 5
            )
        ):
            raise ValidationError(
                'Нужно добавить от 1 до 5 фото.'
            )
        return value

    def validate(self, data):
        service = TechnicalService.objects.get(
            name=data['technical_service']['name']
        )
        # TODO дублирование кода
        scheduled_car_service = CarTechnicalService.objects.filter(
            car__name=data['car']['name'],
            scheduled_date=date.today() + timedelta(days=service.periodicity),
            technical_service__name=data['technical_service']['name']
        ).exists()
        car_service_created_today = CarTechnicalService.objects.filter(
            car__name=data['car']['name'],
            date_service=date.today(),
            technical_service__name=data['technical_service']['name']
        ).exists()
        if (
            not self.instance
            and (
                scheduled_car_service or car_service_created_today
            )
        ):
            raise ValidationError(
                'Такой сервис уже создан или текущий сервис удалён.'
            )
        return data


class CarTechnicalServiceSerializer(serializers.ModelSerializer):
    '''Для Технического обслуживания связанного с автомобилем.'''

    service = serializers.CharField(source='technical_service.name')
    car = serializers.CharField(source='car.name')
    photos = CarTechnicalServicePhotoSerializer(many=True)

    class Meta:
        model = CarTechnicalService
        fields = (
            'author',
            'id',
            'date_service',
            'car',
            'service',
            'photos'
        )


class CarMainPageSerializer(serializers.ModelSerializer):
    '''Для вывода карточек автомобилей на главной страцицы.'''
    photo = serializers.SerializerMethodField()
    hide = serializers.CharField(source='card.hide')

    def get_photo(self, obj):
        '''Получаем первое фото которое отмечено как is_preview в базе
        или первое фото'''
        request = self.context.get('request')
        preview_photo = obj.photos.filter(
            is_preview=True
        ).first()
        if preview_photo:
            return request.build_absolute_uri(preview_photo.photo.url)
        elif len(obj.photos.all()):
            return request.build_absolute_uri(obj.photos.all()[0].photo.url)

    class Meta:
        model = Car
        fields = (
            'id',
            'photo',
            'name',
            'short_description',
            'price',
            'daily_rent',
            'hide'
        )


class CarSerializer(serializers.ModelSerializer):
    '''Получение информации по карточке автомобиля.'''
    # TODO Можно просто вывести список видио и фото в одном списке
    photos = CarPhotoSerializer(many=True, read_only=True)
    videos = CarVideoSerializer(many=True, read_only=True)

    def to_representation(self, instance):
        '''Добавляем техническое обслуживание в ответ если пользователь
        авторизован и этот автомобиль арендует он.'''
        representation = super().to_representation(instance)
        request = self.context.get('request')
        current_user_rents = []
        if request.user.is_authenticated:
            current_user_rents = instance.user_rent.filter(
                user=request.user, complited=False
            )
        if current_user_rents:
            representation['services'] = CarTechnicalServiceSerializer(
                instance.car_technical_services, many=True).data
        return representation

    class Meta:
        model = Car
        fields = (
            'id',
            'photos',
            'videos',
            'name',
            'description',
            'price',
            'daily_rent'
        )


class UserRentSerializer(serializers.ModelSerializer):
    '''Получение информации об арендованных автомобилях,
    что бы отобразить их в профиле пользователя.'''
    # TODO Какая информация ещё может здесь пригодиться
    car_name = serializers.CharField(source='car.name')
    car_photo = serializers.SerializerMethodField()

    def get_car_photo(self, obj):
        '''Получаем первое фото которое отмечено как is_preview в базе'''
        request = self.context.get('request')
        photo = obj.car.photos.filter(
            is_preview=True
        ).first()
        if photo:
            return request.build_absolute_uri(photo.photo.url)

    class Meta:
        model = UserRent
        fields = ('start_rent', 'end_rent', 'car_name', 'car_photo')
