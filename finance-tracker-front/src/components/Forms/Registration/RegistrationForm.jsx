import React, { useState } from 'react';
import 'materialize-css/dist/css/materialize.min.css';  // Підключаємо Materialize CSS
import './RegistrationFormStyle.css';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // Тут можна додати логіку для реєстрації
    console.log('Register submitted', { username, email, password });
  };

  return (
    <div className='form-wrapper'>
      <h3>Sign Up</h3>
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
          </div>
        </form>
      </div>
      <button type="submit" className="btn waves-effect waves-light">Register</button>
    </div>
    
  );
};

export default RegisterForm;
