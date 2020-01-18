# Using Elasticsearch to make querying faster

Just a simple project that compare speed efficiency of search algorithm between Elasticsearch (cluster and single endpoint) and postgres (just single endpoint).

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

-   NPM via [link](https://www.npmjs.com/)
-   docker via [link](https://docs.docker.com/install/)
-   git via [link](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
-   Elasticsearch via [link](https://www.elastic.co/downloads/Elasticsearch)

### Installing

#### 1) Getting Elasticsearch

Here you can decide between using ES cluster or ES single point server.

##### a) ES Cluster

To run ES cluster

```
cd docker-elastic
docker-compose up
```

To test it

```
curl -X GET "localhost:9200/_cat/nodes?v&pretty"
```

To stop it

```
docker-compose down
```

##### b) ES single point server

A step by step series of examples that tell you how to get a development env running

Setup Elasticsearch server (only if you haven't installed run ES cluster from previous section)

```
Follow steps from https://www.elastic.co/downloads/Elasticsearch
```

Run Elasticsearch server (if you haven't run it as cluster already)

```
./bin/Elasticsearch
```

#### 2) Downloading project source code

```
git clone https://github.com/orangeGoran/elastic-api.git
cd elastic-api
npm install
```

#### 3) Creating environment variables

```
cp ./.env.example ./.env
```

#### 4) Setupping docker for postgres database (for simple comparison)

Docker will run the postgres database for us. We are using postgres in order to compare the speed efficiency between postgres and Elasticsearch. Note that docker runs on single point (not distributed).

```
cd ./docker-db
docker build -t school-dbms-pg .
docker run -d --name school-dbms-pg -p 5555:5432 school-dbms-pg
docker container start school-dbms-pg
```

##### a) Filling postgres database

Install sequalize globally and create database

```
cd ./
sudo npm install sequelize-cli -g
sequelize db:migrate
```

#### 5) Running our server

```
cd ./
npm run start:dev
```

### Testing behaviors

Now visit next link

```
http://localhost:9000/api/posts
```

and receive similar response as is provided below. Here we query for banana word in content field from every note. As we still haven't generated any posts total found posts by elastic and postgres are 0.

```
{
    ok: true,
    message: "Queried for banana in posts content.",
    data: {
        queriedWord: "banana",
        elasticsearch: {
            totalTimeNeeded: "00:00:00.004",
            totalPosts: 0,
        },
        postgres: {
            totalTimeNeeded: "00:00:00.005",
            totalPosts: 0,
        },
        comparison: {
            winner: "elasticsearch",
            fasterBy: 1.25,
        },
    },
}
```

In order to generate fake data visit and wait until it finishes.

```
http://localhost:9000/api/generate
```

It should respond with something like json below. In this example it took around 5 seconds to generate 500 posts.

```
{
    ok: true,
    message: "Posts deleted and regenerated",
    data: {
        totalTimeNeeded: "00:00:05.828",
        totalAmountOfCreatedPost: "500",
    },
}
```

If you want to generate more data then visit

```
http://localhost:9000/api/generateMore
```

Now visit [link](http://localhost:9000/api/posts) again and check for the winner. Try changing .env last three values to search for different data, recreate different amount of posts or to generate more posts. In order to see the changes please restart server by typing `rs` in console.

```
...
QUERY_STRING=banana
AMOUNT_OF_POSTS=5000
GENERATE_MORE_POSTS=500
...
```

## Additional links

-   [Setup docker](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/)
-   [More of docker](https://medium.com/@wkrzywiec/database-in-a-docker-container-how-to-start-and-whats-it-about-5e3ceea77e50)
-   [Setup sequalize with postgress](https://dev.to/nedsoft/getting-started-with-sequelize-and-postgres-emp)

## Authors

-   **Goran Tubic** - _Initial work_ - [orangeGoran](https://github.com/orangeGoran)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
