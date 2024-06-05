from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from car_rent_invest.tasks import get_distance


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAdminUser])
def set_distance(request):
    '''Устанавливаем дистанцию за период аренды в базу данных'''
    try:
        cookie_value = request.data.get('id')
        get_distance.delay(cookie_value)
        return Response(
            {"detail": 'Запрос на установление дистанции отправлен.'},
            status=status.HTTP_200_OK
        )
    except Exception:
        return Response(
            {'detail': 'Ошибка при обработке JSON'},
            status=status.HTTP_400_BAD_REQUEST
        )
