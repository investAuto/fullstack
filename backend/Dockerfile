# pull official base image
FROM python:3.10.11

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

# copy project
COPY . /usr/src/app/

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

# В foodgram 
# FROM python:3.9

# WORKDIR /app

# COPY requirements.txt .

# RUN pip install -r requirements.txt --no-cache-dir

# COPY . .

# CMD ["gunicorn", "--bind", "0.0.0.0:8080", "foodgram.wsgi"]