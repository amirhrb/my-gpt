//styles
import Head from 'next/head';
import styles from '../helper/styles/index.module.css';

//fns
import Image from 'next/image';

const offline = () => {
  return (
    <main className={styles.main}>
      <Head>
        <title>You are offline!</title>
      </Head>
      <Image
        src="/images/chatGPT.svg"
        width={45}
        height={45}
        className={styles.icon}
        alt="openai logo"
      />
      <h3>Sorry!</h3>
      <p>An error has accured due to network issues...</p>
    </main>
  );
};

export default offline;
