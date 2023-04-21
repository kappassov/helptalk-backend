import { read } from "fs";
const axios = require("axios");
const dotenv = require("dotenv");
const specs = require("../services/keywords");
const prisma = require("../models/prisma-client");
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
        //model: "text-chat-davinci-002-20221122",
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
  let counter = 0;
  for (let spec in specs) {
    for (let keyword of keywords) {
      if (specs[spec].includes(keyword)) {
        if (!readySpecs[spec]) {
          readySpecs[spec] = 0;
        }

        readySpecs[spec] += 1;
        counter++;
      }
    }
  }

  const sortedSpecs = Object.entries(readySpecs)
    .sort(([, a]: any, [, b]: any) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  return await matchSpecs(sortedSpecs, counter);
};

const matchSpecs = async (sortedSpecs, counter) => {
  try {
    const specialists = await prisma.specialist.findMany({
      include: {
        specializations: true,
        ratings: true
      },
    });

    for (const spec in sortedSpecs) {
      sortedSpecs[spec] /= counter;
      for (let specialist of specialists) {
        if (!specialist.hasOwnProperty("rank")) {
          specialist.rank = 0;
        }
        if (specialist.specializations.some((obj) => obj.name === spec)) {
          specialist.rank += sortedSpecs[spec];
        }
      }
    }

    specialists.sort((a, b) => b.rank - a.rank);
    console.log(sortedSpecs);
    return {
      Specializations: sortedSpecs,
      Specialists: specialists,
    };
  } catch (error: any) {
    console.log(error);
  }
};

module.exports = { sendPrompt };
