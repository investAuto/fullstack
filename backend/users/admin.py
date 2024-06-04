from django.contrib import admin

from .models import CustomUser

admin.site.empty_value_display = 'Не задано'

admin.site.register(CustomUser)
