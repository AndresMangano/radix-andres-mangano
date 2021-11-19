FROM nginx:1.19.10
WORKDIR /usr/share/nginx/html
COPY ./build .
COPY ./server.conf /etc/nginx/conf.d/default.conf
EXPOSE 80