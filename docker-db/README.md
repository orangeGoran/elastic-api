https://medium.com/@wkrzywiec/database-in-a-docker-container-how-to-start-and-whats-it-about-5e3ceea77e50

Create image:

docker build -t school-dbms-pg .

Create container:

docker run -d --name school-dbms-pg -p 5555:5432 school-dbms-pg


docker container start school-dbms-pg
