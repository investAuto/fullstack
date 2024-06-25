from django.conf import settings
from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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
    UploadPhotoSerializer
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
        methods=['GET', 'POST', 'DELETE']
    )
    def upload_photo(self, request):
        '''Добавляем временные фото обслуживания'''
        # TODO как сделать что бы после отправки формы очищалась вся папка
        # TODO и нужно ли это делать
        # TODO или нужно написать тесты или удалить этот эндпоинт
        if request.method == 'GET':
            serializer = UploadPhotoSerializer()
            return Response(serializer.data, status=status.HTTP_200)
        serializer = UploadPhotoSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # @action(
    #     detail=True,
    #     methods=['DELETE'],
    #     # permission_classes=[IsAuthenticated],
    #     url_path='delete_photo/(?P<photo_id>[^/.]+)'
    # )
    # def delete_photo(
    #     self, request, pk=None, photo_id=None
    # ):
    #     '''Удаляем фото обслуживания'''
    #     # TODO обработать ошибку когда такого фото не существует
    # TODO или у сервиса нет этого фото
    #     service = get_object_or_404(CarTechnicalService, pk=pk)
    #     service_photo = service.photos.all().filter(id=photo_id)
    #     if not service_photo:
    #         raise ValidationError('Фото не существует.')
    #     service_photo.delete()
    #     return Response(
    #         'Фото сервиса удалено.', status.HTTP_204_NO_CONTENT
    #     )

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
