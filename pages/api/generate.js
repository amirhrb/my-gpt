const { Configuration, OpenAIApi } = require("openai");
import { isVaild } from "../../helper/utils/fns";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const token = req.cookies["session-token"];
  if (!token)
    return res.status(400).json({ error: { message: "sign in first!" } });

  if (!isVaild(token))
    return res.status(400).json({ message: "sign in first!" });

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const messages = req.body.messages || "";
  if (messages.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "always put all codes in markdown format",
        },
        ...messages,
      ],
    });
    console.log(completion.data.choices[0].message);
    res.status(200).json({
      result: completion.data.choices[0].message,
      question: messages[messages.length - 1],
    });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
