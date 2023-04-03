import { serialize } from "cookie";
import { sign, verify } from "jsonwebtoken";
import { Configuration, OpenAIApi } from "openai";

export function isVaildToken(token) {
  try {
    const result = verify(token, process.env.SECRET_KEY);
    return result;
  } catch (err) {
    return false;
  }
}

export const isVaildKey = async (key) => {
  const configuration = new Configuration({
    apiKey: key,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const response = await openai.listModels();
    if (response.statusText === "OK") {
      return {
        status: "OK",
        message: "Welcome!",
      };
    }
    return {
      status: "UNAUTHORIZED",
      message:
        "This is not a valid api key it from https://platform.openai.com/account/api-keys",
    };
  } catch (error) {
    return {
      status: "UNAUTHORIZED",
      message:
        "This is not a valid api key it from https://platform.openai.com/account/api-keys",
    };
  }
};

export const serializer = (userKey, days = 7) => {
  const expiration = days * 24 * 60 * 60;
  const token = sign({ userKey }, process.env.SECRET_KEY, {
    expiresIn: expiration,
  });
  const serialized = serialize("session-token", token, {
    httpOnly: true,
    path: "/",
    maxAge: expiration,
  });
  return serialized;
};
export const delay = async (time = 300) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};
