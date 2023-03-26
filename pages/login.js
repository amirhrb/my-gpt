import React, { useRef, useState } from "react";
import { useRouter } from "next/router";

//styles
import styles from "../helper/styles/index.module.css";
import Head from "next/head";

const delay = async (time = 500) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

const login = () => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const router = useRouter();
  const inputRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (inputRef.current.value) {
      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessKey: inputRef.current.value }),
        });
        if (response.status === 200) {
          await delay();
          setLoading(false);
          setNote("Welcome, now you will be redirected!");
          router.replace("/");
          return;
        }
        if (response.status !== 200) {
          await delay();
          setNote("wrong pass key!");
          setLoading(false);
          return;
        }
      } catch (error) {
        await delay();
        setNote("an error accured!");
        setLoading(false);
        return;
      }
    }
    setNote("Enter the key!");
    setLoading(false);
    return;
  };
  return (
    <main className={styles.main}>
      <Head>
        <title>login first!</title>
      </Head>
      <img src="/svg/chatGPT.svg" className={styles.icon} />
      <h3>Login</h3>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          placeholder="Enter an your access key"
          ref={inputRef}
        />
        <input
          type="submit"
          value={loading ? "loading..." : "login"}
          disabled={loading}
        />
        {note ? <span>{note}</span> : null}
      </form>
    </main>
  );
};

export default login;
