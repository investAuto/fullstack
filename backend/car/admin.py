from django.contrib import admin
from django.utils.html import format_html

from car.models import (
    Car,
    CarCard,
    CarPhoto,
    CarTechnicalService,
    CarVideo,
    TechnicalService,
    TechnicalServicePhoto
)


class GalleryPhotosInline(admin.TabularInline):
    fk_name = 'car'
    model = CarPhoto
    extra = 0
    min_num = 1


class GalleryVideoInline(admin.TabularInline):
    fk_name = 'car'
    model = CarVideo
    extra = 0
    min_num = 1


class TechnicalServiceInline(admin.TabularInline):
    fk_name = 'car'
    model = Car.technical_service.through
    extra = 0


class CarCardInline(admin.TabularInline):
    fk_name = 'car'
    model = CarCard


class PhotoTechnicalServiceInline(admin.TabularInline):
    fk_name = 'service'
    model = TechnicalServicePhoto
    extra = 0


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    inlines = [
        TechnicalServiceInline,
        GalleryPhotosInline,
        GalleryVideoInline,
        CarCardInline
    ]
    list_display = (
        'name',
        'license_plate',
        'image_tag'
    )
    exclude = ['technical_services']
    @admin.display(description='Изображение')
    def image_tag(self, obj):
        """Получаем изображение связанного авто."""
        if obj.photos.all():
            return format_html(
                '<img src="{}" width="80" height="50" />'.format(
                    obj.photos.all()[0].photo.url)
            )
        return 'Не найдено'

admin.site.register(TechnicalService)


@admin.register(CarTechnicalService)
class CarTechnicalServiceAdmin(admin.ModelAdmin):
    inlines = (PhotoTechnicalServiceInline,)
    list_display = (
        'author',
        'car',
        'technical_service',
        'date_service',
        'scheduled_date',
        'comment',
        'image_tag'
    )
    list_editable = ('scheduled_date',)
    list_filter = ('car',)
    search_fields = ('car__name', 'technical_service__name')
    list_display_links = ('car',)

    @admin.display(description='Изображение')
    def image_tag(self, obj):
        """Получаем изображение связанного авто."""
        if obj.photos.all():
            return format_html(
                '<img src="{}" width="80" height="50" />'.format(
                    obj.photos.all()[0].photo.url)
            )
        return 'Не найдено'
