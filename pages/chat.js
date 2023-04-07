//react
import { useEffect, useRef } from 'react';
//next
import Image from 'next/image';
import { useRouter } from 'next/router';

//zustand
import useAuthStore from '../helper/utils/authStore';
import useChatStore from '../helper/utils/chatStore';

//style
import styles from '../helper/styles/index.module.css';

//toastify
import { toast as toaster } from 'react-toastify';

//components
import Response from '../helper/components/Response';

export default function Chat() {
  const router = useRouter();

  const { refresh, isValid, validating, loading } = useAuthStore(
    (state) => state
  );
  const { messages, inProcess, sendMessage, toast } = useChatStore(
    (state) => state
  );

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!isValid && !loading && !validating) {
      toaster.error('You are not authorized, login first');
      router.replace('login');
    }
  }, [validating]);

  useEffect(() => {
    if (toast.toastMsg) toaster.error(toast.toastMsg);
    const isLoginError =
      toast.toastMsg.toString().indexOf('Please enter an apiKey') > -1;
    if (isLoginError) location.reload();
  }, [toast]);

  useEffect(() => {
    window.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
    inputRef.current.value = '';
  }, [messages]);

  async function submitHandler(event) {
    event.preventDefault();
    if (!inputRef.current.value) {
      toaster.info('ask a question first!');
      return;
    }
    await sendMessage(inputRef.current.value);
  }

  return (
    <main
      className={styles.main}
      style={{ justifyContent: messages.length ? 'flex-end' : 'normal' }}
    >
      <section className={messages.length ? styles.header : styles.iconCont}>
        <Image
          src="/images/chatGPT.svg"
          width={45}
          height={45}
          className={styles.icon}
          alt="openai logo"
        />
        <h3>OpenAi chatgpt</h3>
      </section>
      <div
        className={messages.length ? styles.resultCont : ''}
        ref={containerRef}
      >
        {messages.length
          ? messages.map((message, index) => (
              <Response message={message} key={index} />
            ))
          : ''}
      </div>
      <form
        onSubmit={submitHandler}
        className={messages.length ? styles.fixedForm : ''}
      >
        <textarea type="text" placeholder="Enter your qustion" ref={inputRef} />
        <button disabled={inProcess}>
          {inProcess ? 'loading...' : 'submit'}
        </button>
      </form>
    </main>
  );
}
