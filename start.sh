docker build -t babelfish-frontend .
docker run -d -p  80:80 babelfish-frontend