const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log(`Database Connected`);
  })
  .catch((err) => {
    console.log(err);
    console.log(`Database Not Connected`);
  });
