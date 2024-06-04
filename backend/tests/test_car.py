from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from car.models import Car, CarTechnicalService, TechnicalService
from car_rent_invest.models import UserRent

User = get_user_model()


class GetCarsTest(APITestCase):
    """Тесты для получения автомобиля"""
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            phone='89000000001',
            fullname='Test test',
            password='string111'
        )
        cls.user2 = User.objects.create_user(
            phone='89000000002',
            fullname='Test test2',
            password='string111'
        )
        cls.token = RefreshToken.for_user(cls.user)
        cls.token1 = RefreshToken.for_user(cls.user2)
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
        cls.car2 = Car.objects.create(
            name='Car 2',
            color="#000000",
            description='This is car 2',
            year_release="1980",
            gas=Car.Gas.GAS,
            price=1000000,
            daily_rent=1111,
            license_plate='О355НР73',
            vin='XTA219040P0908893',
            pts='164301061242083',
            sts='99 54 818653',
            status=Car.Status.ON_PARKING
        )
        cls.service1 = TechnicalService.objects.create(
            name='TechnicalService 1'
        )
        cls.service2 = TechnicalService.objects.create(
            name='TechnicalService 2'
        )
        cls.car_service1 = CarTechnicalService.objects.create(
            author=cls.user,
            car=cls.car1,
            technical_service=cls.service1,
            scheduled_date=date(2024, 5, 14)
        )

        cls.car_service2 = CarTechnicalService.objects.create(
            author=cls.user,
            car=cls.car1,
            technical_service=cls.service2,
            scheduled_date=date(2024, 5, 14)
        )
        cls.user_rent1 = UserRent.objects.create(
            car=cls.car1,
            user=cls.user,
            start_rent='2025-05-14',
            end_rent='2025-05-25'
        )

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

    def test_get_all_cars(self):
        '''Получаем все карточки на первой странице каталога.'''
        url = reverse('cars-list')
        response = self.unauth_client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get('results')), 2)

    def test_get_car_by_id(self):
        '''Получаем карточку автомобиля.'''
        url = reverse('cars-detail', kwargs={'pk': self.car2.id})
        response = self.unauth_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.car2.id)
        self.assertEqual(response.data['photos'], [])
        self.assertEqual(response.data['videos'], [])
        self.assertEqual(response.data['name'], 'Car 2')
        self.assertEqual(response.data['description'], 'This is car 2')
        self.assertEqual(response.data['price'], 1000000)
        self.assertEqual(response.data['daily_rent'], 1111)

    def test_get_car_by_id_with_services(self):
        '''Получаем карточку автомобиля со связанными с ней техническим
        обслуживанием показываем обслуживание только если пользователь
        арендует данный автомобиль.
        '''
        url = reverse('cars-detail', kwargs={'pk': self.car1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.car1.id)
        self.assertEqual(len(response.data.get('services')), 2)
        self.assertEqual(
            response.data.get('services')[0]['service'],
            self.car1.car_technical_services.all()[0].technical_service.name
        )

    def test_get_car_by_id_without_services(self):
        '''Проверяем что авторизованный пользователь который
        не арендовал автомобиль не может видеть техническое обслуживание.
        '''
        url = reverse('cars-detail', kwargs={'pk': self.car1.id})
        response = self.another_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('services'), None)
