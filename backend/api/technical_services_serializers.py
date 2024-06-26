from datetime import date, timedelta

from django.db import transaction
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from car.models import (
    Car,
    CarTechnicalService,
    TechnicalService,
    TechnicalServicePhoto,
)


class TechnicalServiceSerializer(serializers.ModelSerializer):
    '''Для работы с техничискими обслуживаниями.'''
    class Meta:
        model = TechnicalService
        fields = ('id', 'name')


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
    # car = serializers.CharField(source='car.name')
    car = serializers.CharField(source='car.license_plate')
    photos = CarTechnicalServicePhotoSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        '''Когда пользователь добавляет сервис,
        находим последний невыполненный сервис,
        если мы его не нашли то создаём сервис с текущей датой выполнения,
        если нашли то добавляем ему дату выполнения и ставим статус выполнено,
        после этого если есть периодичность выполнени,
        создаём запланированный сервис.
        '''
        photos = validated_data.pop('photos')
        service = TechnicalService.objects.get(
            name=validated_data.pop('technical_service').get('name')
        )
        car = Car.objects.get(
            license_plate=validated_data.pop('car').get('license_plate')
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
        if service.periodicity:
            CarTechnicalService.objects.create(
                author=self.context.get('request').user,
                technical_service=service,
                scheduled_date=(
                    date.today() + timedelta(days=service.periodicity)
                ),
                comment=validated_data.get('comment'),
                car=car
            )

        for photo_data in photos:
            TechnicalServicePhoto.objects.create(
                service=current_service, **photo_data
            )
        return current_service

    @transaction.atomic
    def update(self, instance, validated_data):
        '''Обновление технического сервиса.
        Находим все фото текущего сервиса удаляем их потом добавляем заново.'''
        validated_data.pop('technical_service')
        validated_data.pop('car')
        photos = validated_data.pop('photos')
        remove_photos_ids = self.initial_data.get('remove_photos_ids')

        if remove_photos_ids:
            instance.photos.all().filter(id__in=remove_photos_ids).delete()

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
        if not Car.objects.filter(license_plate=value).exists():
            raise serializers.ValidationError(
                'Авто с таким гос.номером не существует.'
            )
        return value

    def validate_service(self, value):
        if not TechnicalService.objects.filter(name=value).exists():
            raise serializers.ValidationError(
                'Такого сервиса не существует'
            )
        return value

    def validate_photos(self, value):
        method = self.context.get('request').method
        count_of_photos_in_patch_request = (
            self.instance.photos.count()
            + len(value)
            - len(self.initial_data.get('remove_photos_ids'))
        )
        if (
            method == 'PATCH'
                and (
                    count_of_photos_in_patch_request < 1
                    or count_of_photos_in_patch_request > 5
                )
        ):
            raise ValidationError(
                'Нужно добавить от 1 до 5 фото.'
            )

        if (method == 'POST'
            and (
                not len(value)
                or (
                    self.instance
                    and (self.instance.photos.count() + len(value) > 5)
                    or len(value) > 5
                ))):
            raise ValidationError(
                'Нужно добавить от 1 до 5 фото.'
            )
        return value

    def validate(self, data):
        service = TechnicalService.objects.get(
            name=data['technical_service']['name']
        )
        scheduled_car_service = (
            service.periodicity and CarTechnicalService.objects.filter(
                car__license_plate=data['car']['license_plate'],
                scheduled_date=(
                    date.today() + timedelta(days=service.periodicity)
                ),
                technical_service__name=data['technical_service']['name']
            ).exists()
        )
        car_service_created_today = CarTechnicalService.objects.filter(
            car__license_plate=data['car']['license_plate'],
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
    car_license_plate = serializers.CharField(source='car.license_plate')
    photos = CarTechnicalServicePhotoSerializer(many=True)

    class Meta:
        model = CarTechnicalService
        fields = (
            'author',
            'id',
            'date_service',
            'car_license_plate',
            'service',
            'photos',
            'comment'
        )
