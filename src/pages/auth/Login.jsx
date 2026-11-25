import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Input } from '../../components/common/Input';

export function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registrationNotice = location.state?.notice;

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await signIn(credentials);
      setCredentials({ email: '', password: '' });
      navigate('/', { replace: true });
    } catch (error) {
      const apiError = error;
      setErrorMessage(apiError.status === 401
        ? 'Email or password is incorrect. Please try again.'
        : apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <p className="eyebrow">WELCOME BACK</p>
      <h1>Sign in to your account</h1>
      <p className="form-description">Use your registered email and password.</p>
      {registrationNotice && <p className="success-inline" role="status">{registrationNotice}</p>}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <Input id="login-email" label="Email address" type="email" autoComplete="username" required value={credentials.email}
        onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} />
      <Input id="login-password" label="Password" type="password" autoComplete="current-password" required value={credentials.password}
        onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} />
      <Button className="form-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Checking credentials…' : 'Sign in'} <span aria-hidden="true">→</span>
      </Button>
      <p className="form-footer">New to Northstar? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
