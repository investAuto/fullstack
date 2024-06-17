from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from car.models import Car, CarPhoto
from car_rent_invest.models import UserRent

User = get_user_model()


class GetRentTest(APITestCase):
    """Тесты для получения аренды автомобиля"""

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            phone='89000000001',
            fullname='Test test',
            password='string111'
        )
        cls.token = RefreshToken.for_user(cls.user)
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
        cls.car_photo1 = CarPhoto.objects.create(
            photo='Car1_photo',
            car=cls.car1,
            is_preview=True
        )
        cls.car_photo2 = CarPhoto.objects.create(
            photo='Car2_photo',
            car=cls.car1
        )
        cls.user_rent1 = UserRent.objects.create(
            car=cls.car1,
            user=cls.user,
            start_rent='2024-05-14',
            end_rent='2024-05-25'
        )
        cls.user_rent2 = UserRent.objects.create(
            car=cls.car2,
            user=cls.user,
            start_rent='2024-05-20',
            end_rent='2024-05-28',
        )
        cls.url = '/api/v1/cars/my_rents/'

    def setUp(self):
        self.client = APIClient()
        self.unauth_client = APIClient()
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {str(self.token.access_token)}'
        )

    def test_my_rent_by_auth_user(self):
        '''Тест для получения аренд авторизованного пользователя пользователя.
        '''
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['start_rent'], '2024-05-14')
        self.assertEqual(response.data[0]['end_rent'], '2024-05-25')
        self.assertEqual(response.data[0]['car_name'], self.car1.name)
        self.assertEqual(
            response.data[0]['car_license_plate'], self.car1.license_plate
        )
        self.assertIsNotNone(response.data[0]['car_photo'])

    def test_get_my_rent_by_unauth_user(self):
        '''Получение информации по эндпоинту
        my_rents для неавторизованного пользователя.'''
        response = self.unauth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
