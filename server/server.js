const cookieParser = require("cookie-parser");
const teamRouter = require("./routes/note.js");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

app.use(cors({
	credentials: true,
  }));

app.use(express.json());
app.use(cookieParser());

app.use(teamRouter);

app.listen(port, () => {
  console.log("Server started at " + port);
});
