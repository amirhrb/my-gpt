//react
import { useState, useEffect, useRef } from "react";

//next
import Head from "next/head";
import { useRouter } from "next/router";

//style
import styles from "../helper/styles/index.module.css";

import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function Home() {
  const router = useRouter();

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "user",
      content: "write some random codes in js",
    },
    {
      role: "assistant",
      content:
        '```javascript\n// This is a random function that adds two numbers\nfunction add(num1, num2) {\n  return num1 + num2;\n}\n\n// We can call the function with different parameters:\nlet num3 = add(42, 8); // num3 will be 50\nlet num4 = add(13, -5); // num4 will be 8\n\n// This is a random object with some properties and methods\nlet person = {\n  name: "John",\n  age: 35,\n  hobbies: ["reading", "painting", "gardening"],\n  greet: function() {\n    console.log("Hi, my name is " + this.name);\n  }\n};\n\n// We can access the object\'s properties and call its methods like this:\nconsole.log(person.name); // Output: "John"\nperson.greet(); // Output: "Hi, my name is John"\n```',
    },
  ]);
  const [loading, setLoading] = useState(false);

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
    event.preventDefault();
    if (!inputRef.current.value) {
      alert("ask a question!");
      return;
    }
    setLoading(true);
    try {
      // console.log("here");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: inputRef.current.value },
          ],
        }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setMessages((prev) => [...prev, data.question, data.result]);
      inputRef.current.value = "";
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  }
  useEffect(() => {
    window.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
    console.log(messages);
  }, [messages]);

  return (
    <>
      <main className={styles.main}>
        <div
          className={messages.length ? styles.iconCont : ""}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src="/svg/chatGPT.svg" className={styles.icon} />
          <h3>Answer my question</h3>
        </div>
        <div
          className={messages.length ? styles.resultCont : ""}
          ref={containerRef}
        >
          {messages.length
            ? messages.map((message, index) => (
                <div
                  key={index}
                  className={styles.resultItem}
                  dir={/[\u0591-\u07FF]/.test(message.content) ? "rtl" : "ltr"}
                >
                  <h4>{message.role === "user" ? "YOU:" : "AI:"}</h4>
                  <div className={styles.result}>
                    <ReactMarkdown
                      children={message.content}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              //   showLineNumbers
                              PreTag="section"
                              language={match[1]}
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              `{children}`
                            </code>
                          );
                        },
                      }}
                    />
                  </div>
                </div>
              ))
            : ""}
        </div>
        <form
          onSubmit={onSubmit}
          className={messages.length ? styles.fixedForm : ""}
        >
          <textarea
            type="text"
            placeholder="Enter your qustion"
            ref={inputRef}
          />
          <input
            type="submit"
            value={loading ? "loading..." : "Submit"}
            disabled={loading}
          />
        </form>
      </main>
    </>
  );
}
