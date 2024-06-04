from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from car_rent_invest.views import set_distance

from notifications.views import send_notification

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    path("send_notification/", send_notification, name='send_notification'),
    path("set_distance/", set_distance, name='set_distance')
]

if settings.DEBUG:
    urlpatterns += (
        static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    )
