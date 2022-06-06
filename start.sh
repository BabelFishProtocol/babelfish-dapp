DATE=$(date +%F__%H-%M-%S)

docker build -t babelfish-frontend_$DATE .
docker run -d -p  80:80 babelfish-frontend_$DATE
