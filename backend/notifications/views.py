from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from notifications.tasks import create_emails


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdminUser])
def send_notification(request):
    if request.method == 'GET':
        create_emails.delay()
        return JsonResponse(
            {"detail": 'success'}, status=status.HTTP_202_ACCEPTED
        )
    return JsonResponse(
        {"detail": 'Invalid request'},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )
