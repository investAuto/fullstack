from rest_framework import permissions


class IsAuthenticatedOrAdminOrMechanic(permissions.BasePermission):
    '''При просмотре, изменении или удалении проверяем,
    что изменяет или удаляет автор или админ или механик
    При получении проверяем что пользователь аутентифицирован.'''

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):

        return (
            request.user.is_mechanic
            or request.user.is_admin
            or request.user == obj.author
        )
