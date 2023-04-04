//react
import { useEffect, useRef, useState } from "react";
//next
import { useRouter } from "next/router";

//zustand
import useAuthStore from "../helper/utils/authStore";
import useChatStore from "../helper/utils/chatStore";

//style
import styles from "../helper/styles/index.module.css";

//formater
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

//toastify
import { toast as toaster } from "react-toastify";
import ErrorBoundary from "../helper/components/ErrorBoundary";

export default function Chat() {
  const router = useRouter();

  const { refresh, isValid, validating, loading } = useAuthStore(
    (state) => state
  );
  const {
    messages,
    inProcess,
    sendMessage,
    toast: { status, toastMsg },
  } = useChatStore((state) => state);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    refresh();
  }, []);
  useEffect(() => {
    if (!isValid && !loading && !validating) {
      toaster.error("You are not authorized, login first");
      router.replace("login");
    }
  }, [validating]);
  useEffect(() => {
    if (toastMsg) toaster.error(toastMsg);
  }, [toastMsg]);
  useEffect(() => {
    window.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
    inputRef.current.value = "";
  }, [messages]);

  async function submitHandler(event) {
    event.preventDefault();
    if (!inputRef.current.value) {
      toaster.info("ask a question first!");
      return;
    }
    await sendMessage(inputRef.current.value);
  }

  return (
    <main
      className={styles.main}
      style={{ justifyContent: messages.length ? "flex-end" : "normal" }}
    >
      <section className={messages.length ? styles.header : styles.iconCont}>
        <img src="/images/chatGPT.svg" className={styles.icon} />
        <h3>OpenAi chatgpt</h3>
      </section>
      <div
        className={messages.length ? styles.resultCont : ""}
        ref={containerRef}
      >
        {messages.length
          ? messages.map((message, index) => (
              <ErrorBoundary key={index}>
                <article
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
                </article>
              </ErrorBoundary>
            ))
          : ""}
      </div>
      <form
        onSubmit={submitHandler}
        className={messages.length ? styles.fixedForm : ""}
      >
        <textarea type="text" placeholder="Enter your qustion" ref={inputRef} />
        <button disabled={inProcess}>
          {inProcess ? "loading..." : "submit"}
        </button>
      </form>
    </main>
  );
}
