FROM nginx:alpine

RUN rm /etc/nginx/conf.d/*

WORKDIR /var/www/html
COPY . .

COPY ./nginx.conf /etc/nginx/conf.d/web.conf
RUN rm ./nginx.conf
