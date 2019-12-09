-   Good tutorial for sequalize:

https://dev.to/nedsoft/getting-started-with-sequelize-and-postgres-emp

-   DOCKER PostgreSQL

a) Adding cotnainer and running it:

docker run --name school-dbms-pg -e POSTGRES_PASSWORD=12qw34er -p 5432:5432 -d postgres

b) Entering into console of docker

docker exec -it school-dbms-pg bash

psql -U postgres

-   To setup docker visit: https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

-   To run elastic search visit:
    TODO: add it to .dockerfile
    /home/gogi/Workspace/elasticsearch/elasticsearch-7.4.2/bin/elasticsearch

-   To run kibana visit:

/home/gogi/Workspace/elasticsearch/kibana-7.4.2-linux-x86_64/bin
