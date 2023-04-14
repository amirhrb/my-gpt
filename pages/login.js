import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useAuthStore from '../helper/utils/authStore';
//styles
import styles from '../helper/styles/index.module.css';

//fns
import { toast as toaster } from 'react-toastify';
import Image from 'next/image';

const login = () => {
  const [isShown, setShown] = useState(false);
  const router = useRouter();
  const keyRef = useRef();

  const { refresh, login, isValid, loading, toast } = useAuthStore(
    (state) => state
  );

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (toast.status === 'success') toaster.success(toast.message);
    else if (toast.status) {
      toaster.error(toast.message);
    }
  }, [toast]);

  useEffect(() => {
    if (isValid) {
      toaster(`🦄You are authorized, redirecting to chat page`);
      router.replace('chat');
    }
  }, [isValid]);

  const onSubmit = async (e) => {
    //prevent reload and set in loading state
    e.preventDefault();
    await login(keyRef.current.value);
  };
  return (
    <main className={styles.main}>
      <Head>
        <title>login page</title>
      </Head>
      <Image
        src="/images/chatGPT.svg"
        width={45}
        height={45}
        className={styles.icon}
        alt="openai logo"
        priority
      />
      <h3>OpenAi Login</h3>
      <form onSubmit={onSubmit}>
        <div className={styles.inputContainer}>
          <input
            type={isShown ? 'text' : 'password'}
            placeholder="Enter an api key or admin password"
            ref={keyRef}
          />
          <span
            className={styles.eye}
            onClick={() => setShown((prev) => !prev)}
          >
            <img
              src={
                isShown
                  ? '/sources/show-password.png'
                  : '/sources/show-password-active.png'
              }
            />
          </span>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'loading...' : 'Login'}
        </button>
      </form>
    </main>
  );
};

export default login;
