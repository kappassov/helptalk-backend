import { read } from "fs";

const axios = require("axios");
const dotenv = require("dotenv");
const specs = require("../services/keywords");
dotenv.config();
axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${process.env.OPENAI_API}`;

const sendPrompt = async (req, res) => {
  let prompt: string = req.body.prompt;

  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: `Give me keywords of \"${prompt}\" issues`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        best_of: 3,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + process.env.OPENAI_API,
        },
      }
    );

    return res.status(200).json({
      Specializations: await linkKeywords(data.choices[0].text),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
};

const linkKeywords = async (data: string) => {
  const keywords = data
    .split("\n")
    .filter((str) => str !== "")
    .map((str) => {
      return str
        .replace(/[0-9.)]/g, "")
        .replace("-", "")
        .trim()
        .toLowerCase();
    });

  const readySpecs = {};
  console.log(keywords);

  for (let spec in specs) {
    for (let keyword of keywords) {
      if (specs[spec].includes(keyword)) {
        if (!readySpecs[spec]) {
          readySpecs[spec] = 0;
        }
        //console.log("inc");

        readySpecs[spec] += 1;
      }
    }
  }
  //{Family: 3}
  console.log(readySpecs);

  return readySpecs;
};

module.exports = { sendPrompt };
