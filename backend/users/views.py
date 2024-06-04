from django.contrib.auth import get_user_model
from djoser.views import UserViewSet

from users.serializers import CustomUserSerializer

User = get_user_model()


class UserViewSer(UserViewSet):

    # pagination_class = None
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.AllowAny]
    # filter_backends = (DjangoFilterBackend,)
    # filterset_class = IngredientSearchFilter

    def get_queryset(self):
        # TODO Это временное решение что бы показать список пользователей
        # Todo позже лучше использовать djoser
        return User.objects.all()

    # def get_serializer_class(self):
    #     '''Выбираем сериализатор зависимо от того это каталог на главной
    #     или получение всей информации об автомобиле
    #     '''
    #     if self.action == 'retrieve':
    #         return CarSerializer
    #     return CustomUserSerializer
