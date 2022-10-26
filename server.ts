const express = require("express");
const cors = require("cors");
const app = express();
import {book} from "./booking/appointment"

// const corsOptions = {
//   origin: "http://localhost:8081",
// };



app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/book", book)

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log('Listening on port %s', PORT));


