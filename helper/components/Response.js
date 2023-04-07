import React from 'react';

//components
import ErrorBoundary from './ErrorBoundary';

//formater
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

//style
import styles from '../styles/index.module.css';

const Response = ({ message }) => {
  if (message) {
    return (
      <ErrorBoundary>
        <article
          className={`${styles.resultItem} ${
            message?.role !== 'user' ? styles.resultItemAI : ''
          }`}
          dir={/[\u0591-\u07FF]/.test(message?.content) ? 'rtl' : 'ltr'}
        >
          <h4>{message?.role === 'user' ? 'YOU:' : 'AI:'}</h4>
          <div className={styles.result}>
            <ReactMarkdown
              children={message?.content}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
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
    );
  }
  return '';
};

export default Response;
