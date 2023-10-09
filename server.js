const app = require("./app");
const mongoose = require("mongoose");

const DBUrl = process.env.MONGO_URI;
console.log(DBUrl);

mongoose
  .connect(DBUrl, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then((con) => console.log("DB Connected "))
  .catch((err) => console.log(err));

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
