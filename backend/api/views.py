from django.conf import settings
from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from email.header import Header

from api.car_serializers import (
    CarMainPageSerializer,
    CarSerializer,
    UserRentSerializer
)
from api.permissions import IsAuthenticatedOrAdminOrMechanic
from api.technical_services_serializers import (
    CarTechnicalServicePhotoSerializer,
    CarTechnicalServiceSerializer,
    CreateCarTechnicalServiceSerializer,
    TechnicalServiceSerializer,
)
from car.models import Car, CarTechnicalService, TechnicalService
from car_rent_invest.models import UserRent


class CarViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Car.objects.all()
    serializer_class = CarMainPageSerializer

    def get_serializer_class(self):
        '''Выбираем сериализатор зависимо от того это каталог на главной
        или получение всей информации об автомобиле
        '''
        if self.action == 'retrieve':
            return CarSerializer
        return self.serializer_class

    def get_queryset(self):
        '''Получаем все не скрытые карточки.'''
        return self.queryset.filter(~Q(card__hide=True))

    @action(
        detail=False,
        methods=['GET'],
        permission_classes=[IsAuthenticatedOrAdminOrMechanic]
    )
    def my_rents(self, request):
        '''Получаем список арендованных автомобилей принадлежащие пользователю.
        '''
        rents = UserRent.objects.filter(user=request.user, complited=False)
        serializer = UserRentSerializer(
            rents, many=True, context={'request': request}
        )
        return Response(serializer.data)

    @action(
        detail=True,
        methods=['POST'],
        permission_classes=[AllowAny]
    )
    def send_application(self, request, pk=None):
        '''Отправка заявки на аренду или покупку.'''
        if not request.data.get('carName') or not request.data.get('phone'):
            return Response(
                'Отсутствует название авто или телефон.',
                status=status.HTTP_400_BAD_REQUEST
            )

        name = (
            'Имя отправителя: ' +
            (request.data.get('name') or 'не указано') +
            '\n'
        )
        car_name = 'Название авто: ' + request.data.get('carName') + '\n'
        phone = 'Телефон: ' + request.data.get('phone')

        send_mail(
            subject=Header('Заявка на аренду или покупку.', 'utf-8'),
            message=name + car_name + phone,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=True,
        )
        return Response('Заявка отправлена!', status=status.HTTP_200_OK)


class CarTechnicalServiceViewSet(viewsets.ModelViewSet):

    pagination_class = None
    queryset = CarTechnicalService.objects.all()
    http_method_names = ('delete', 'get', 'patch', 'post')
    serializer_class = CarTechnicalServiceSerializer
    permission_classes = [IsAuthenticatedOrAdminOrMechanic]

    def get_serializer_class(self):
        '''Выбирает сериализатор, в зависимости от метода запроса.'''
        if self.request.method == 'GET':
            return self.serializer_class
        return CreateCarTechnicalServiceSerializer

    def get_queryset(self):
        '''Получаем сервисы автомобиля.'''
        if self.request.user.is_client and self.action == 'list':
            return self.queryset.filter(
                author=self.request.user
            )[:settings.NUMBER_OF_SERVICES_FOR_CLIENT]
        elif self.action == 'list':
            return self.queryset[:settings.NUMBER_OF_SERVICES_FOR_ADMIN]
        return self.queryset

    @action(
        detail=True,
        methods=['GET']
    )
    def get_photos(self, request, pk=None):
        serializer = CarTechnicalServicePhotoSerializer(
            self.get_object().photos.all(),
            many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=['GET'],
        permission_classes=[IsAuthenticated]
    )
    def get_services(self, request):
        '''Получаем все технические обслуживания для получения имён.'''
        serializer = TechnicalServiceSerializer(
            TechnicalService.objects.all(), many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
