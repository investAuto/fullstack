from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

from users.views import InvestAutoUserViewSet

router_v1 = DefaultRouter()

router_v1.register(r'users', InvestAutoUserViewSet, basename='users')

urlpatterns = [
    path('', include(router_v1.urls)),
    path('', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.jwt')),
]
