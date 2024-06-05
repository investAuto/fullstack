from rest_framework import serializers

from api.technical_services_serializers import CarTechnicalServiceSerializer
from car.models import Car, CarPhoto, CarVideo
from car_rent_invest.models import UserRent


class CarPhotoSerializer(serializers.ModelSerializer):
    '''Для вывода нескольких фото автомобиля.'''
    class Meta:
        model = CarPhoto
        fields = ('photo', 'car')


class CarVideoSerializer(serializers.ModelSerializer):
    '''Для вывода нескольких видео автомобиля.'''
    class Meta:
        model = CarVideo
        fields = ('video', 'car')


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
