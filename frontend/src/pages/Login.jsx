import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import '../styles/Auth.css';

export default function Login({ onLoginSuccess }) {
  const { login, signup, loading, error } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;

    if (isSignup) {
      success = await signup(formData.username, formData.email, formData.password);
    } else {
      success = await login(formData.email, formData.password);
    }

    if (success) {
      onLoginSuccess();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🎵 Playlist</h1>
        <h2>{isSignup ? 'Create Account' : 'Login'}</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="toggle-auth">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button type="button" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
