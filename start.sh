docker build -t babelfish-frontend .
docker run -d -p  8080:80 babelfish-frontend