from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class GetUserTest(APITestCase):
    '''Тесты для получения пользователя'''
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            phone='89000000001',
            fullname='Test test',
            password='string111'
        )
        cls.token = RefreshToken.for_user(cls.user)
        cls.url = '/api/v1/users/me/'

    def setUp(self):
        self.client = APIClient()
        self.unauth_client = APIClient()
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {str(self.token.access_token)}'
        )

    def test_get_me_auth_user(self):
        '''Получение информации по эндпоинту 
        me для авторизованного пользоватея с токеном.'''
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_me_unauthorized_user(self):
        '''Получение информации по эндпоинту 
        me для неавторизованного пользователя.'''
        response = self.unauth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
