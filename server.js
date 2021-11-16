const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...".red.bold.underline);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("MongoDB connections successful!".cyan.underline.bold)
  );

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`.magenta.bold);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLER REJECTION! Shutting down...".red.bold.underline);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
