import React from 'react';
import './Auth.style.scss';
import { Link, withRouter } from 'react-router-dom';
import * as firebase from 'firebase';
import withFirebaseAuth, {
  WrappedComponentProps
} from 'react-with-firebase-auth';
import firebaseApp from '../../Utils/configFirebase';
import { connect } from 'react-redux';

interface Props {}

export interface IAppProps {
  user: WrappedComponentProps;
  signInWithGoogle: WrappedComponentProps;
  signInWithFacebook: WrappedComponentProps;
  signInWithTwitter: WrappedComponentProps;
  signInWithGithub: WrappedComponentProps;
  createUserWithEmailAndPassword: WrappedComponentProps;
  error: WrappedComponentProps;
  history: any;
}

export interface IAppState {
  name: string;
  email: string;
  pass: string;
  re_pass: string;
  isError: boolean;
  errorMessage: [];
  successMessage: [];
}

class Register extends React.Component<
  IAppProps & WrappedComponentProps,
  IAppState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      name: '',
      email: '',
      pass: '',
      re_pass: '',
      isError: false,
      errorMessage: [],
      successMessage: []
    };
  }

  handleSubmit = async (event: any) => {
    event.preventDefault();
    let tempIsError = false;
    let errorMessage = [];
    let successMessage: string[] = [];

    if (this.state.name === '') {
      tempIsError = true;
      errorMessage.push('Field -Name- should not be empty!');
    }
    if (this.state.email === '') {
      tempIsError = true;
      errorMessage.push('Field -Email- should not be empty!');
    }
    if (this.state.pass === '') {
      tempIsError = true;
      errorMessage.push('Field -Password- should not be empty!');
    }
    if (
      this.state.pass !== '' &&
      this.state.re_pass &&
      this.state.pass !== this.state.re_pass
    ) {
      tempIsError = true;
      errorMessage.push('-Password- should match -Password Repeat-');
    }
    if (this.state.re_pass === '') {
      tempIsError = true;
      errorMessage.push('Field -Password Repeat- should not be empty!');
    }
    if (
      tempIsError === false &&
      this.state.email !== '' &&
      this.state.pass !== ''
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.pass)
        .then(res => {
          successMessage.push('Account created with success. Please Log in.');
        })
        .catch(function(error) {
          if (error) {
            tempIsError = true;
            errorMessage.push(error.message);
          }
          return error.message;
        });

      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          user.updateProfile({
            displayName: this.state.name,
            photoURL: 'https://via.placeholder.com/500x500'
          });
        }
      });
    }
    this.setState(({
      isError: tempIsError,
      errorMessage: errorMessage,
      successMessage: successMessage
    } as unknown) as Pick<IAppState, keyof IAppState>);
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
      <div className='main'>
        <section className='signup'>
          <div className='container'>
            <div className='signup-content'>
              <div className='signup-form'>
                <h2 className='form-title'>Sign up</h2>
                {this.state.errorMessage.map(msg => {
                  return (
                    <div className='alert alert-danger' role='alert'>
                      {msg}
                    </div>
                  );
                })}
                {this.state.successMessage.map(msg => {
                  return (
                    <div className='alert alert-success' role='alert'>
                      {msg}
                    </div>
                  );
                })}

                <form
                  onSubmit={this.handleSubmit}
                  className='register-form'
                  id='register-form'
                >
                  <div className='form-group'>
                    <label htmlFor='name'>
                      <i className='zmdi zmdi-account material-icons-name'></i>
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      onChange={this.handleInputChange}
                      value={this.state.name}
                      placeholder='Your Name'
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='email'>
                      <i className='zmdi zmdi-email'></i>
                    </label>
                    <input
                      type='email'
                      name='email'
                      id='email'
                      minLength={6}
                      onChange={this.handleInputChange}
                      value={this.state.email}
                      placeholder='Your Email'
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='pass'>
                      <i className='zmdi zmdi-lock'></i>
                    </label>
                    <input
                      type='password'
                      name='pass'
                      id='pass'
                      minLength={6}
                      onChange={this.handleInputChange}
                      value={this.state.pass}
                      placeholder='Password'
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='re-pass'>
                      <i className='zmdi zmdi-lock-outline'></i>
                    </label>
                    <input
                      type='password'
                      name='re_pass'
                      id='re_pass'
                      minLength={6}
                      onChange={this.handleInputChange}
                      value={this.state.re_pass}
                      placeholder='Repeat your password'
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <input
                      type='checkbox'
                      name='agree-term'
                      id='agree-term'
                      className='agree-term'
                    />
                    <label htmlFor='agree-term' className='label-agree-term'>
                      <span>
                        <span></span>
                      </span>
                      I agree all statements in{' '}
                      <a href='#2' className='term-service'>
                        Terms of service
                      </a>
                    </label>
                  </div>
                  <div className='form-group form-button'>
                    <input
                      type='submit'
                      name='signup'
                      id='signup'
                      className='form-submit'
                      value='Register'
                    />
                  </div>
                </form>
              </div>
              <div className='signup-image'>
                <figure>
                  <img src='/img/signup-image.jpg' alt='sing up' />
                </figure>
                <Link to='/login' className='signup-image-link'>
                  I am already member
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  facebookProvider: new firebase.auth.FacebookAuthProvider(),
  githubProvider: new firebase.auth.GithubAuthProvider()
};

export default withRouter(
  connect()(
    withFirebaseAuth({
      providers,
      firebaseAppAuth
    })(Register)
  )
);
