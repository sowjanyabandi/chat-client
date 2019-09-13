/* global EventSource */

import React from "react";
import request from "superagent";

import { url } from "./constants";

class App extends React.Component {
  state = {
    text: "",
    messages: []
  };

  source = new EventSource(`${url}/stream`);

  componentDidMount() {
    this.source.onmessage = event => {
      const { data } = event;

      const messages = JSON.parse(data);
      this.setState({ messages });
    };
  }

  onChange = event => {
    const {
      target: { value }
    } = event;
    console.log("value test:", value);

    this.setState({ text: value });
  };

  onSubmit = event => {
    event.preventDefault();

    const { text } = this.state;

    request
      .post(`${url}/message`)
      .send({ text })
      .then(response => {
        console.log(response);
        this.setState({ text: "" });
      })
      .catch(console.error);
  };

  onDelete = () => {
    request
      .delete(`${url}/message`)
      .then(console.log)
      .catch(console.error);
  };

  render() {
    const { messages } = this.state;

    console.log("messages:", messages);

    const items = messages.map((message, index) => (
      <li key={index}>{message.text}</li>
    ));

    return (
      <main>
        <form onSubmit={this.onSubmit}>
          <input type="text" onChange={this.onChange} value={this.state.text} />

          <button>send</button>
        </form>

        <button onClick={this.onDelete}>delete</button>

        <ul>{items}</ul>
      </main>
    );
  }
}

export default App;
