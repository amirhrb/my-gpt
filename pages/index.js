//react
import { useState, useEffect } from "react";

//next
import Head from "next/head";
import { useRouter } from "next/router";

//style
import styles from "../helper/styles/index.module.css";

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(["", ""]);

  useEffect(() => {
    const authorized = async () => {
      const response = await fetch("/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        router.replace("/login");
      }
      return data;
    };
    authorized();
  }, []);

  async function onSubmit(event) {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messages }),
      });
      setPrompt("");
      const data = await response.json();
      console.log(data);
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(() => data.result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <>
      <main className={styles.main}>
        <img src="/svg/chatGPT.svg" className={styles.icon} />
        <h3>Answer my question</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter your qustion"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <input
            type="submit"
            value={loading ? "loading..." : "Submit"}
            disabled={loading}
          />
        </form>
        <div
          className={styles.resultCont}
          dir={/[\u0591-\u07FF]/.test(result[1]) ? "rtl" : "ltr"}
        >
          {result[0] ? (
            <>
              <h4>You:</h4>
              <code className={styles.question}>{result[0]}</code>
              <h4>AI:</h4>
              <code className={styles.result}>{result[1]}</code>
            </>
          ) : (
            ""
          )}
        </div>
      </main>
    </>
  );
}
