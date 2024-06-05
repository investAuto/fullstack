### Описание проекта:
invest-auto


### Как запустить проект:
`git clone git@github.com:дописать.git` -> клонировать репозиторий\

**При помощи docker**\
    Перед началом нужно установить и запустить Docker.\
    `docker compose up` -> запустить Docker Compose\
    Открыть новый терминал\
    `docker compose exec backend python manage.py collectstatic` -> cобрать статику Django\
    `docker compose exec backend cp -r /app/collected_static/. /backend_static/static/` -> копируем статику(backend) на volume\
    `docker compose exec backend python manage.py migrate` -> выполнить миграции\
    `docker compose exec backend python manage.py createsuperuser` -> создать суперпользователя\
    `docker compose exec backend python manage.py import_csv` -> импорт ингредиентов и тегов в БД из файлов csv

После запуска будут доступны следующие адреса:\
    - авторизация -> http://localhost:8080 \
    - админка -> http://localhost:8080/admin/ \
    - документация -> http://localhost:8080/api/docs/

Дополнительные команды для работы:\
    `docker compose up --build` -> пересборка контейнеров\
    `docker compose stop` -> остановить Docker Compose\
    `docker compose down` -> остановить Docker Compose и удалить все контейнеры

**Без docker**\
При запуске использовались следующие версии пакетов:
- Nodejs -> v15.9.0???
- npm -> 7.5.3???
- Python -> 3.9.10???
- pip -> 24.0???

Запуск **backend**\
Примечание: для того чтобы использовать sqlite3 раскомментируйте этот блок(DATABASE) в файле backend/kittygram_backend/settings и закомментируйте блок с postgresql.

* Если у вас Linux/macOS\
    `python3 -m venv env` -> создать виртуальное окружение\
    `source env/bin/activate` -> активировать виртуальное окружение\
    `python3 -m pip install --upgrade pip` -> обновить установщик\
    `cd backend` -> перейти в папку\
    `pip install -r requirements.txt` -> установить зависимости из файла requirements.txt\
    `python3 manage.py migrate` -> выполнить миграции\
    `python3 manage.py createsuperuser` -> создать суперпользователя\
    `python3 manage.py runserver` -> запустить проект\
    `python3 manage.py import_csv` -> импорт ингредиентов и тегов в БД из файлов csv

* Если у вас windows\
    `python -m venv venv` -> создать виртуальное окружение\
    `source venv/Scripts/activate` -> активировать виртуальное окружение\
    `python -m pip install --upgrade pip` -> обновить установщик\
    `pip install -r requirements.txt` -> установить зависимости из файла requirements.txt\
    `cd backend` -> перейти в папку\
    `python manage.py migrate` -> выполнить миграции\
    `python manage.py createsuperuser` -> создать суперпользователя\
    `python manage.py runserver` -> запустить проект\
    `python manage.py import_csv` -> импорт ингредиентов и тегов в БД из файлов csv

Запуск **frontend** нужно выполнять в другом терминале

`cd frontend` -> перейти в папку\
`npm i` или `npm i --force` -> установить зависимости\
`npm run start` -> запуск приложения

После запуска будут доступны следующие адреса:
- авторизация -> http://localhost:3000/
- админка -> http://127.0.0.1:8000/admin/
- документация -> http://127.0.0.1:5500/docs/redoc.html (если запустить файл docs/redoc.html при помощи live server)

### Как тестировать проект:
Коллекция запросов для Postman. Для тестирования и отладки работы текущей версии API для проекта Foodgram. Вы можете импортировать эту коллекцию в Postman и выполнять запросы для проверки функциональности API.

Подробная инструкция по работе с коллекцией находится в файле /postman_collection/README.md.

### Cписок используемых технологий:

- Django
- React
- djangorestframework
- Docker

### Как заполнить файл .env:
В проекте есть файлы .env.example заполните свои по аналогии.

`SECRET_KEY` - ключ приложения джанго\
`DEBUG` - ключение режима разработчика\
`ALLOWED_HOSTS` - разрешённые хосты которые могут обращаться к этому приложению

`ALLOWED_HOSTS` - разрешённые хосты которые могут обращаться к этому приложению\
`EMAIL_HOST`- сервер, который используется для отправки электронной почты.\
`EMAIL_PORT` - порт, который используется для подключения к EMAIL_HOST\
`EMAIL_HOST_USER` - аккаунт/логин для авторизации на EMAIL_HOST\
`EMAIL_HOST_PASSWORD` - пароль для авторизации на EMAIL_HOST\
`EMAIL_USE_TLS` и `EMAIL_USE_SSL` - параметры, определяющие\
 использование протоколов безопасности при подключении к серверу электронной почты\
`EMAIL_TARGET_LOGIN`, `EMAIL_TARGET_PSW`, `EMAIL_TARGET_SENDER`,`EMAIL_TARGET_RECIPIENT` - данные для отправки почты\
`GDEGAZEL_URL` адрес сайта с которого берутся данные о пройденном расстоянии автомобиля\
`CELERY_BROKER `- URL-адрес сервера сообщений для Celery, фреймворка для асинхронного выполнения задач в Python.

`POSTGRES_DB` - название базы\
`POSTGRES_USER` - пользователь базы\
`POSTGRES_PASSWORD` - пароль к базе\
`DB_NAME` - имя базы\
`DB_HOST` - имя контейнера, где запущен сервер БД\
`DB_PORT` - порт, по которому Django будет обращаться к базе данных\
`DB_SQLIGTH` - если эта переменная есть используется база sqlite если нет то postgres\


Автор: Сафонов Сергей\
Почта: [sergey_safonov86@inbox.ru](mailto:sergey_safonov86@inbox.ru)
