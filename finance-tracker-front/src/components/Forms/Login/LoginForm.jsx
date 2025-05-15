import React, { useState } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './LoginFormStyle.css';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/AuthSlice';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
      if (error?.status === 401 || error?.message?.includes('Incorrect email or password')) {
        setErrorMessage('Incorrect email or password.');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className='form-wrapper'>
      <h3 className='h3-login'>Log In</h3>
      <div className="row">
        <form className="col s12" onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-field">
              <input
                id="email"
                type="email"
                className="validate"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field">
              <input
                id="password"
                type="password"
                className="validate"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>

          {errorMessage && (
            <p style={{ color: 'red', margin: '0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif', fontSize: '15px' }}>{errorMessage}</p>
          )}

          <button type="submit" className="btn waves-effect waves-light">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
