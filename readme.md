- For auth error =>
- Delete pgdata and =>
```sh
docker-compose down --volumes
docker-compose up --force-recreate
```