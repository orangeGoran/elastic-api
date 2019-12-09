# Using elasticsearch to make querying faster

Just a simple project that compare speed efficiency of search algorithm between elasticsearch and postgres.

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

-   NPM via [link](https://www.npmjs.com/)
-   docker via [link](https://docs.docker.com/install/)
-   git via [link](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
-   elasticsearch via [link](https://www.elastic.co/downloads/elasticsearch)

### Installing

A step by step series of examples that tell you how to get a development env running

Run elasticsearch server

```
Follow steps from https://www.elastic.co/downloads/elasticsearch
```

Download project source code

```
git clone https://github.com/orangeGoran/elastic-api.git
cd elastic-api
npm install
```

Create environment variables

```
cp ./.env.example ./.env
```

Setup docker which will runs the postgres database for us

```
cd ./docker-db
docker build -t school-dbms-pg .
docker run -d --name school-dbms-pg -p 5555:5432 school-dbms-pg
docker container start school-dbms-pg
```

Install sequalize globally and create database

```
cd ./
sudo npm install sequelize-cli -g
sequelize db:migrate
```

Run server

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

Now visit [link](http://localhost:9000/api/posts) again and check for the winner. Try changing .env last three fields for different results.

## Additional links

-   [Setup docker](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/)
-   [More of docker](https://medium.com/@wkrzywiec/database-in-a-docker-container-how-to-start-and-whats-it-about-5e3ceea77e50)
-   [Setup sequalize with postgress](https://dev.to/nedsoft/getting-started-with-sequelize-and-postgres-emp)

## Authors

-   **Goran Tubic** - _Initial work_ - [orangeGoran](https://github.com/orangeGoran)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
