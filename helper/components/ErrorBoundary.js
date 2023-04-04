import React, { Component } from "react";

//styles
import styles from "../styles/index.module.css";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
    this.setState({ hasError: true });
  }
  render() {
    if (this.state.hasError) {
      return (
        <article
          className={styles.resultItem}
          dir="ltr"
          style={{ color: "tomato" }}
        >
          <h4>{"ERROR:"}</h4>
          <div className={styles.result}>
            <p style={{ color: "tomato" }}>Something went wrong.</p>
          </div>
        </article>
      );
    }

    return this.props.children;
  }
}
