git pull
yarn install
yarn build
docker-compose up -d --build --force-recreate --renew-anon-volumes --always-recreate-deps 

# just for health check
docker image ls 
docker container ls
