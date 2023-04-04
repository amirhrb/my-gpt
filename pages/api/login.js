import { isVaildKey, serializer } from "../../helper/utils/fns";

export default async function (req, res) {
  if (req.method !== "POST")
    return res.status(403).json({ status: "failure", message: "bad request" });
  const { userKey } = req.body;
  if (userKey === process.env.ACCESS_KEY) {
    const days = 3;
    const serialized = serializer(process.env.OPENAI_API_KEY, days);
    return res
      .status(201)
      .setHeader("Set-Cookie", serialized)
      .json({ status: "successful", message: "خوش هاتی براگم!" });
  }
  if (!userKey || userKey.length < 10) {
    return res
      .status(501)
      .json({ status: "failure", message: "Enter a valid key!" });
  }
  const keyResult = await isVaildKey(userKey);
  if (keyResult.status === "OK") {
    const days = 90;
    const serialized = serializer(userKey, days);
    return res
      .status(200)
      .setHeader("Set-Cookie", serialized)
      .json({ status: "successful", message: keyResult.message });
  } else if (keyResult.status === "UNAUTHORIZED") {
    res.status(401).json({
      status: "failure",
      message: keyResult.message,
    });
  } else {
    return res.json({ message: "error in process of key" });
  }
}
