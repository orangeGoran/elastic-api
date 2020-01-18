let characters = [
    "A",
    "a",
    "B",
    "b",
    "C",
    "c",
    "D",
    "d",
    "E",
    "e",
    "F",
    "f",
    "G",
    "g",
    "H",
    "h",
    "I",
    "i",
    "J",
    "j",
    "K",
    "k",
    "L",
    "l",
    "M",
    "m",
    "N",
    "n",
    "O",
    "o",
    "P",
    "p",
    "Q",
    "q",
    "R",
    "r",
    "S",
    "s",
    "T",
    "t",
    "U",
    "u",
    "V",
    "v",
    "W",
    "w",
    "X",
    "x",
    "Y",
    "y",
    "Z",
    "z",
    ".",
    ",",
    "-",
    ";",
];

let charactersBanana = ["B", "A", "N"];

const models = require("../database/models");

const sequelize = require("sequelize");

const { Client } = require("@elastic/elasticsearch");
const ecl = new Client({ node: process.env.ELASTIC_HOST });

const ES_INDEX_POST = "post";

function msToHMS(ms) {
    return new Date(ms).toISOString().slice(11, -1);
}

const generateMorePosts = async (req, res) => {
    let startDate = new Date();
    let totalTimeNeeded;
    try {
        for (var i = 0; i < process.env.GENERATE_MORE_POSTS; i++) {
            let content = "";
            let title =
                charactersBanana[
                    Math.floor(Math.random() * charactersBanana.length)
                ];

            for (var j = 0; j < process.env.AMOUNT_OF_WORDS; j++) {
                for (var k = 0; k < process.env.WORD_LENGTH; k++) {
                    content +=
                        charactersBanana[
                            Math.floor(Math.random() * charactersBanana.length)
                        ];
                }
                content += " ";
            }

            const post = await models.Post.create({
                title,
                content,
                userId: 1,
            });
            // index already exists
            let nekaj = await ecl.index({
                index: ES_INDEX_POST,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: post.dataValues,
            });

            if (i % 100 === 0 && i !== 0) {
                console.log("... generated", i, "posts ...");
            }
        }

        console.log(" Generated", i, "posts in total.");

        console.log("Refreshing indices ...");
        await client.indices.refresh({ index: ES_INDEX_POST });
    } catch (e) {
    } finally {
        totalTimeNeeded = msToHMS(new Date() - startDate);

        res.send({
            ok: true,
            message: "Posts deleted and regenerated",
            data: {
                totalTimeNeeded: totalTimeNeeded,
                totalAmountOfCreatedPost: process.env.GENERATE_MORE_POSTS,
            },
        });
    }
};

const postGenerator = async (req, res) => {
    console.log("-------------- Preparing ----------------");

    try {
        console.log("Deleting index from ecl ...");

        let del_index = await ecl.indices.delete({
            index: ES_INDEX_POST,
        });

        console.log(" Index deleted.");
    } catch (e) {}

    try {
        console.log("Creating new index on ecl ...");

        let new_index = await ecl.indices.create({
            index: ES_INDEX_POST,
        });
        console.log(" Index created.");
    } catch (e) {}

    try {
        console.log("Deleting all posts from pg ...");

        const deleted = await models.Post.destroy({
            where: {},
        });
        console.log(" Deleted", deleted, "rows from pg");
        console.log();
    } catch (e) {
    } finally {
    }

    console.log("-------------- Generating ----------------");

    let startDate = new Date();
    let totalTimeNeeded;
    try {
        for (var i = 0; i < process.env.AMOUNT_OF_POSTS; i++) {
            let content = "";
            let title =
                charactersBanana[
                    Math.floor(Math.random() * charactersBanana.length)
                ];

            for (var j = 0; j < process.env.AMOUNT_OF_WORDS; j++) {
                for (var k = 0; k < process.env.WORD_LENGTH; k++) {
                    content +=
                        charactersBanana[
                            Math.floor(Math.random() * charactersBanana.length)
                        ];
                }
                content += " ";
            }

            const post = await models.Post.create({
                title,
                content,
                userId: 1,
            });
            // index already exists
            let nekaj = await ecl.index({
                index: ES_INDEX_POST,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: post.dataValues,
            });

            if (i % 100 === 0 && i !== 0) {
                console.log("... generated", i, "posts ...");
            }
        }

        console.log(" Generated", i, "posts in total.");

        console.log("Refreshing indices ...");
        await client.indices.refresh({ index: ES_INDEX_POST });
    } catch (e) {
    } finally {
        totalTimeNeeded = msToHMS(new Date() - startDate);

        res.send({
            ok: true,
            message: "Posts deleted and regenerated",
            data: {
                totalTimeNeeded: totalTimeNeeded,
                totalAmountOfCreatedPost: process.env.AMOUNT_OF_POSTS,
            },
        });
    }
};

const createPost = async (req, res) => {
    try {
        const post = await models.Post.create(req.body);
        // index already exists
        let nekaj = await ecl.index({
            index: ES_INDEX_POST,
            // type: '_doc', // uncomment this line if you are using {es} ≤ 6
            body: post.dataValues,
        });

        res.send(nekaj);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        let dateNow = new Date();
        let result = await ecl.search({
            index: ES_INDEX_POST,
            body: {
                query: {
                    match: {
                        content: process.env.QUERY_STRING,
                    },
                },
            },
        });

        let totalTimeNeededMS = new Date() - dateNow;
        let totalTimeNeededFULL = msToHMS(totalTimeNeededMS);

        let dateNow2 = new Date();
        const posts = await models.Post.findAll({
            where: {
                content: sequelize.where(
                    sequelize.fn("LOWER", sequelize.col("content")),
                    "LIKE",
                    "%" + process.env.QUERY_STRING + "%"
                ),
            },
        });

        let totalTimeNeededMS2 = new Date() - dateNow2;
        let totalTimeNeededFULL2 = msToHMS(totalTimeNeededMS2);

        return res.status(200).json({
            ok: true,
            message:
                "Queried for " +
                process.env.QUERY_STRING +
                " in posts content.",
            data: {
                queriedWord: process.env.QUERY_STRING,
                elasticsearch: {
                    totalTimeNeeded: totalTimeNeededFULL,
                    totalPosts: result.body.hits.total.value,
                },
                postgres: {
                    totalTimeNeeded: totalTimeNeededFULL2,
                    totalPosts: posts.length,
                },
                comparison: {
                    winner:
                        totalTimeNeededMS < totalTimeNeededMS2
                            ? "elasticsearch"
                            : "postgres",
                    fasterBy:
                        totalTimeNeededMS < totalTimeNeededMS2
                            ? totalTimeNeededMS2 / totalTimeNeededMS
                            : totalTimeNeededMS / totalTimeNeededMS2,
                },
            },
        });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await models.Post.findOne({
            where: { id: postId },
            include: [
                {
                    model: models.Comment,
                    as: "comments",
                    include: [
                        {
                            model: models.User,
                            as: "author",
                        },
                    ],
                },
                {
                    model: models.User,
                    as: "author",
                },
            ],
        });
        if (post) {
            return res.status(200).json({ post });
        }
        return res
            .status(404)
            .send("Post with the specified ID does not exists");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const [updated] = await models.Post.update(req.body, {
            where: { id: postId },
        });
        if (updated) {
            const updatedPost = await models.Post.findOne({
                where: { id: postId },
            });
            return res.status(200).json({ post: updatedPost });
        }
        throw new Error("Post not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const deleted = await models.Post.destroy({
            where: { id: postId },
        });
        if (deleted) {
            return res.status(204).send("Post deleted");
        }
        throw new Error("Post not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    postGenerator,
    generateMorePosts,
};
