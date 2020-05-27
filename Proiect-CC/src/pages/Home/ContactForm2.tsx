import * as React from "react";
import * as firebase from "firebase";

export interface IAppProps {}

export interface IAppState {
  subject: string;
  name: string;
  email: string;
  message: string;
}

export default class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      subject: "",
      name: "",
      email: "",
      message: ""
    };
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    const { subject, name, email, message } = this.state;
    firebase
      .database()
      .ref("posts/")
      .push({
        subject,
        name,
        email,
        message
      })
      .then(res => {
        this.setState({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      })
      .catch(err => {
        alert("error");
      });
  };

  handleInputChange = (event: any) => {
    let name = event.target.name;
    let value = event.target.value;

    this.setState(({
      [name]: value
    } as unknown) as Pick<IAppState, keyof IAppState>);
  };

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          id="subject"
          name="subject"
          value={this.state.subject}
          placeholder="Your Subject"
          className="av-input"
          onChange={this.handleInputChange}
          required
        />
        <input
          type="text"
          id="name"
          name="name"
          value={this.state.name}
          placeholder="Your Name"
          className="av-input"
          onChange={this.handleInputChange}
          required
        />
        <input
          type="email"
          id="email"
          name="email"
          value={this.state.email}
          placeholder="Your Email"
          className="av-input"
          onChange={this.handleInputChange}
          required
        />
        <textarea
          name="message"
          id="message"
          value={this.state.message}
          rows={8}
          placeholder="Message"
          className="av-input"
          onChange={this.handleInputChange}
          required
        ></textarea>
        <button type="submit" className="btn btn-info av-btn-submit">
          Submit
        </button>
      </form>
    );
  }
}
