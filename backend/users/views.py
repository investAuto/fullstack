from django.contrib.auth import get_user_model
from djoser.views import UserViewSet

User = get_user_model()


class InvestAutoUserViewSet(UserViewSet):

    pagination_class = None
