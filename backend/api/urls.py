from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import CarTechnicalServiceViewSet, CarViewSet

router_v1 = DefaultRouter()

router_v1.register('cars', CarViewSet, basename='cars')
router_v1.register('services', CarTechnicalServiceViewSet, basename='services')

urlpatterns = [
    path('v1/', include(router_v1.urls)),
    path('v1/', include('users.urls')),
]
