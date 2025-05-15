import React, { useState } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './RegistrationFormStyle.css';
import { useDispatch } from 'react-redux';
import { register } from '../../../store/AuthSlice';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      await dispatch(register({ username, email, password })).unwrap();
    } catch (error) {
      console.error('Registration failed:', error);
      if (error?.status === 409) {
        setErrorMessage('A user with this email already exists.');
      } else if (error?.status === 400) {
        setErrorMessage('Invalid registration data.');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className='form-wrapper'>
      <h3 className='h3-registration'>Sign Up</h3>
      <div className="row">
        <form className="col s12" onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-field">
              <input
                id="username"
                type="text"
                className="validate"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="username">Name</label>
            </div>
          </div>
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
          <div className="row">
            <div className="input-field col s12">
              <input
                id="confirmPassword"
                type="password"
                className="validate"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            {errorMessage && (
            <p style={{ color: 'red', margin: '0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif', fontSize: '15px' }}>{errorMessage}</p>
          )}
          </div>
          <button type="submit" className="btn waves-effect waves-light">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
