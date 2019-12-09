require("dotenv").config();

const server = require("./server");

const PORT = process.env.SERVER_PORT || 9000;

server.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`));
