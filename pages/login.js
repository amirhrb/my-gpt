import React, { useRef } from "react";
import { useRouter } from "next/router";

const login = () => {
  const router = useRouter();
  const inputRef = useRef();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessKey: inputRef.current.value }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      if (response.status === 200) {
        // alert(data.message);
        router.replace("/");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Enter an your access key"
          ref={inputRef}
        />
        <input type="submit" value="Generate answer" />
      </form>
    </div>
  );
};

export default login;
