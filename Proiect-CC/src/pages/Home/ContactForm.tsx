import * as React from 'react';
import * as firebase from 'firebase';
import { Toast } from 'react-bootstrap';
export interface IAppProps {}

export interface IAppState {
  subject: string;
  email: string;
  name: string;
  message: string;
  showToast: boolean;
}

export default class ContactForm extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      subject: '',
      email: '',
      name: '',
      message: '',
      showToast: false
    };
  }

  handleInputChange = (event: any) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState(({
      [name]: value
    } as unknown) as Pick<IAppState, keyof IAppState>);
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    const { subject, name, email, message } = this.state;
    firebase
      .database()
      .ref('contact/')
      .push({
        subject,
        name,
        email,
        message
      })
      .then(res => {
        console.log(res);
        this.setState({
          name: '',
          email: '',
          subject: '',
          message: '',
          showToast: true
        });
      })
      .catch(err => {
        alert('error');
      });
  };

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <Toast
            onClose={() => this.setState({ showToast: false })}
            show={this.state.showToast}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <img
                src='holder.js/20x20?text=%20'
                className='rounded mr-2'
                alt=''
              />
              <strong className='mr-auto'>Infinite Team</strong>
            </Toast.Header>
            <Toast.Body>Thank you for your message.</Toast.Body>
          </Toast>
        </div>
        <input
          id='subject'
          name='subject'
          value={this.state.subject}
          type='text'
          placeholder='Your Subject'
          className='av-input'
          onChange={this.handleInputChange}
          required
        />
        <input
          id='name'
          name='name'
          type='text'
          value={this.state.name}
          placeholder='Your Name'
          className='av-input'
          onChange={this.handleInputChange}
          required
        />
        <input
          id='email'
          name='email'
          type='email'
          value={this.state.email}
          placeholder='Your Email'
          onChange={this.handleInputChange}
          className='av-input'
          required
        />
        <textarea
          id='message'
          name='message'
          value={this.state.message}
          rows={8}
          placeholder='Message'
          className='av-input'
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
