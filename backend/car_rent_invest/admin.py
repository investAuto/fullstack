from django.contrib import admin

from car_rent_invest.models import UserRent

# admin.site.register(UserRent)


@admin.register(UserRent)
class UserRentAdmin(admin.ModelAdmin):

    list_display = (
        'car', 'user', 'distance', 'start_rent', 'end_rent', 'complited'
    )
    list_editable = ('start_rent', 'distance', 'end_rent', 'complited')
