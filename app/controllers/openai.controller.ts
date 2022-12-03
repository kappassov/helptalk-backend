const axios = require("axios");
const dotenv = require("dotenv");

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
        model: "text-davinci-002",
        prompt: "Give me keywords of " + prompt,
        temperature: 0.1,
        max_tokens: 256,
        top_p: 1,
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

    //console.log(JSON.stringify(data, null, 4));

    return res.status(200).json({
      message: data.choices[0].text,
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

module.exports = {sendPrompt};
