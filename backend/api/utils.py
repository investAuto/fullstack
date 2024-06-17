def get_car_photo(request, car):
    '''Получаем первое фото которое отмечено как is_preview в базе
    или первое фото'''
    preview_photo = car.photos.filter(
        is_preview=True
    ).first()
    if preview_photo:
        return request.build_absolute_uri(preview_photo.photo.url)
    elif len(car.photos.all()):
        return request.build_absolute_uri(car.photos.all()[0].photo.url)
