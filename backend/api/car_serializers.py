from rest_framework import serializers

from api.technical_services_serializers import CarTechnicalServiceSerializer
from api.utils import get_car_photo
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
        '''Получаем фото автомобиля для вывода на главную.'''
        return get_car_photo(self.context.get('request'), obj)

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
    car_license_plate = serializers.CharField(source='car.license_plate')
    car_photo = serializers.SerializerMethodField()

    def get_car_photo(self, obj):
        '''Получаем фото автомобиля для аренды'''
        return get_car_photo(self.context.get('request'), obj.car)

    class Meta:
        model = UserRent
        fields = (
            'car_id',
            'start_rent',
            'end_rent',
            'car_name',
            'car_photo',
            'car_photo',
            'car_license_plate'
        )
