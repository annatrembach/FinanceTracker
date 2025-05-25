import React, { useState } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './RegistrationFormStyle.css';
import { useDispatch } from 'react-redux';
import { register } from '../../../store/AuthSlice';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      await dispatch(register({ name, email, password })).unwrap();
      navigate('/dashboard'); 
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
                id="name"
                type="text"
                className="validate"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="name">Name</label>
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
              <p style={{ color: 'red', margin: '0 0', fontSize: '15px' }}>{errorMessage}</p>
            )}
          </div>
          <button type="submit" className="register-button">Ok</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
