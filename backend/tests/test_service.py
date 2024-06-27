
import base64
import os
from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from car.models import (
    Car,
    CarTechnicalService,
    TechnicalService,
    TechnicalServicePhoto
)

User = get_user_model()


class GetServiceTest(APITestCase):
    '''Тесты для получения добавление и удаления сервиса'''

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            phone='89000000001',
            fullname='Test test',
            password='string111'
        )
        cls.user1 = User.objects.create_user(
            phone='89000000002',
            fullname='Test test1',
            password='string111'
        )
        cls.token = RefreshToken.for_user(cls.user)
        cls.token1 = RefreshToken.for_user(cls.user1)
        cls.car1 = Car.objects.create(
            name='Car 1',
            color="#000000",
            description='This is car 1',
            year_release="1980",
            gas=Car.Gas.GAS,
            price=1000000,
            daily_rent=1111,
            license_plate='О355НР71',
            vin='XTA219040P0908891',
            pts='164301061242087',
            sts='99 54 818652',
            status=Car.Status.ON_PARKING
        )
        cls.service1 = TechnicalService.objects.create(
            name='замена масла',
            description='Описание сервиса',
            periodicity=15
        )
        cls.service2 = TechnicalService.objects.create(
            name='замена масла2',
            description='Описание сервиса2',
            periodicity=30
        )
        cls.car_service1 = CarTechnicalService.objects.create(
            author=cls.user,
            car=cls.car1,
            technical_service=cls.service1,
            date_service=date(2024, 5, 14),
            scheduled_date=date(2024, 5, 14),
            comment='Описание сервиса 1'
        )
        cls.car_service2 = CarTechnicalService.objects.create(
            author=cls.user,
            car=cls.car1,
            technical_service=cls.service2,
            scheduled_date=date(2024, 5, 14),
            comment='Описание сервиса 1'
        )
        cls.car_service_photo1 = TechnicalServicePhoto.objects.create(
            photo='photo2',
            service=cls.car_service1
        )
        cls.car_service_photo2 = TechnicalServicePhoto.objects.create(
            photo='photo',
            service=cls.car_service1
        )
        cls.url = '/api/v1/services/'
        cls.remove_photos_ids = [cls.car_service_photo1.id]

    def setUp(self):
        self.client = APIClient()
        self.another_client = APIClient()
        self.unauth_client = APIClient()
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {str(self.token.access_token)}'
        )
        self.another_client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {str(self.token1.access_token)}'
        )

    @staticmethod
    def get_photo_data():
        '''Получаем токен для авторизации пользователя'''
        with open(
            os.path.join(os.path.dirname(__file__), 'images\\test_image.png'),
            'rb'
        ) as photo:
            photo_data = base64.b64encode(photo.read()).decode('utf-8')
            return {'photo': f'data:image/png;base64,{photo_data}'}

    @staticmethod
    def get_service_data(
            self, photos, remove_photos_ids=None, comment='test_comment'
    ):
        '''Получаем данные для конкретного сервиса автомобиля'''
        return {
            'car': self.car1.license_plate,
            'service': self.service1.name,
            'photos': photos,
            'comment': comment,
            'remove_photos_ids': remove_photos_ids
        }

    def test_get_services_by_auth_user(self):
        '''Тест для получение добавленных сервисов.'''
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['id'], self.car_service1.id)
        self.assertEqual(
            response.data[0]['date_service'],
            str(self.car_service1.date_service)
        )
        self.assertEqual(
            response.data[0]['car_license_plate'], self.car1.license_plate
        )
        self.assertEqual(
            response.data[0]['service'],
            self.car_service1.technical_service.name
        )
        self.assertEqual(len(response.data[0]['photos']), 2)

    def test_get_photos_of_service(self):
        '''Тест для получение фотограффий отдельного
        сервиса автором этого сервиса.
        '''
        response = self.client.get(
            f'{self.url}{self.car_service1.id}/get_photos/')
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_photos_of_service_by_another_user(self):
        '''Тест для получение фотограффий отдельного сервиса
        другим пользователем(не автором).
        '''
        response = self.another_client.get(
            f'{self.url}{self.car_service1.id}/get_photos/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_service_by_auth_user(self):
        '''Тест на добавление сервиса авторизованным пользователем'''

        response = self.client.post(
            self.url,
            self.get_service_data(self, [self.get_photo_data()]),
            format='json'
        )
        self.assertEqual(response.status_code, 201)
        current_car_service = CarTechnicalService.objects.filter(
            comment='test_comment'
        ).first()
        self.assertEqual(current_car_service.car, self.car1)
        self.assertEqual(current_car_service.photos.count(), 1)

    def test_add_service_by_unauth_user(self):
        '''Тест на добавление сервиса неавторизованным пользователем'''

        response = self.unauth_client.post(
            self.url,
            self.get_service_data(self, [self.get_photo_data()]),
            format='json'
        )
        self.assertEqual(
            response.status_code, status.HTTP_401_UNAUTHORIZED
        )

    def test_add_service_without_photo(self):
        '''Тест на добавление сервиса без фото'''

        response = self.client.post(
            self.url,
            self.get_service_data(self, []),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            CarTechnicalService.objects.filter(author=self.user).count(), 2
        )

    def test_update_service_by_auth_user(self):
        '''Тест на обновление сервиса авторизованным пользователем'''
        photo = self.get_photo_data()
        response = self.client.patch(
            f'{self.url}{self.car_service1.id}/',
            self.get_service_data(
                self,
                [photo, photo],
                self.remove_photos_ids,
                'Обновлённый комментарий'
            ),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        current_car_service = CarTechnicalService.objects.get(
            id=self.car_service1.id)
        self.assertEqual(current_car_service.car, self.car1)
        self.assertEqual(
            current_car_service.comment, 'Обновлённый комментарий'
        )
        self.assertEqual(current_car_service.photos.count(), 3)

    def test_update_service_by_not_author(self):
        '''Тест на обновление сервиса не автором этого сервиса.'''
        photo = self.get_photo_data()
        response = self.another_client.patch(
            f'{self.url}{self.car_service1.id}/',
            self.get_service_data(self, [photo, photo]),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_technical_services_by_auth_user(self):
        '''Тест на получение всех обслуживаний для получения имён
        авторизованным пользователем.'''
        response = self.client.get(f'{self.url}get_services/')
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_technical_services_by_not_auth_user(self):
        '''Тест на получение всех обслуживаний для получения имён
        неавторизованным пользователем.'''
        response = self.unauth_client.get(f'{self.url}get_services/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
