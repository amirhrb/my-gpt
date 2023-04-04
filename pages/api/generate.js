import { isVaildToken } from "../../helper/utils/fns";

import { Configuration, OpenAIApi } from "openai";

export default async function (req, res) {
  if (req.method !== "POST")
    return res.status(403).json({ status: "failure", message: "bad request" });
  const token = req.cookies["session-token"];
  if (!token) {
    return res.status(401).json({
      status: "failure",
      message: "Please enter an apiKey",
    });
  }
  const { userKey } = isVaildToken(token);
  if (!userKey) {
    return res.status(401).setHeader("Set-Cookie", emptyCookie).json({
      status: "failure",
      message: "Please enter an apiKey",
    });
  }
  const configuration = new Configuration({
    apiKey: userKey,
  });
  const openai = new OpenAIApi(configuration);

  const messages = req.body.messages || "";
  if (messages.length === 0) {
    return res.status(400).json({
      status: "failure",
      message: "Please enter a valid prompt",
    });
  }
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "please always put all codes in markdown format that matches the code language",
        },
        ...messages,
      ],
    });
    res.status(200).json({
      result: completion.data.choices[0].message,
      question: messages[messages.length - 1],
    });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        status: "failure",
        message: "An error occurred during your request.",
      });
    }
  }
}
