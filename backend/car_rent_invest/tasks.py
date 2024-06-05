from datetime import date

import requests
from celery import shared_task
from car_rent_invest.models import UserRent


def _get_gdegazel_id(rents, all_autos_json):
    '''Принимаем список аренд и всех автомобилей в формате json и
    возвращаем словарь с id в gdegazel и гос. номерами автомобилей из базы
    если эти автомобили зарегистрированы на сайте gdegazel
    '''
    cars_obj = {}
    for rent in rents:
        for id_car, value in all_autos_json.items():
            if rent.car.license_plate in value['title']:
                cars_obj[id_car] = rent.car.license_plate
    return cars_obj


def _update_rent_distance(cars_obj, cookies=''):
    '''Принимает словарь с id в gdegazel и гос. номерами автомобилей из базы
    и cookies, делает запросы на сайт gdegazel по каждому автомобилю
    получает пройденное расстояние за весь период аренды
    и обновляет значение пройденного пути в базе аренд.
    '''
    for id_in_gdegazel, license_plate in cars_obj.items():
        cyrrent_rent = UserRent.objects.filter(
            complited=False, car__license_plate=license_plate
        ).last()

        response = requests.get(
            # запрос для получения одного автомобиля
            f'https://gdegazel.ru/gps/way.php?id={id_in_gdegazel}'
            f'&from={str(cyrrent_rent.start_rent)}+00%3A00%3A00'
            f'&till={str(date.today())}+23%3A59%3A59',
            cookies=cookies
        )

        current_auto_resopnse_json = response.json()
        cyrrent_rent = UserRent.objects.filter(
            complited=False, car__license_plate=license_plate
        ).last()
        cyrrent_rent.distance = int(
            float(current_auto_resopnse_json['way']))
        cyrrent_rent.save()


@shared_task
def get_distance(cookie_value):
    '''Получаем даныне всех автомобилей с сайта gdegazel,
    если запрос выполнился успешно, делаем запрос за расстояниями
    которые прошли автомобили и обновляем данные в нашей базе.
    '''
    cookies = {
        'PHPSESSID': cookie_value
    }
    response = requests.get(
        # запрос для получения всех автомобилей
        'https://gdegazel.ru/gps/gps.php?uid=2386&v=20210208',
        cookies=cookies
    )
    if response.status_code == 200:
        rents = UserRent.objects.filter(complited=False)
        all_autos_json = response.json()
        cars_obj = _get_gdegazel_id(rents, all_autos_json)
        _update_rent_distance(cars_obj, cookies)
        return 'Запрос прошёл без ошибок'
    else:
        print('Ошибка:', response.status_code)
        return 'Ошибка на стороннем API'
