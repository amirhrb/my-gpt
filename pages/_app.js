import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>chatgpt</title>
        <meta
          name="description"
          content="ChatGPT is an artificial-intelligence (AI) chatbot developed by OpenAI and launched in November 2022."
        />
        <meta name="author" content="amirhrb" />
      </Head>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
