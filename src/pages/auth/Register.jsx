import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer } from '../../services/authService';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Input } from '../../components/common/Input';

export function Register() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await registerCustomer(credentials);
      setCredentials({ email: '', password: '' });
      navigate('/login', { replace: true, state: { notice: 'Registration complete. Sign in with your new credentials.' } });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <p className="eyebrow">GET STARTED</p>
      <h1>Create your profile</h1>
      <p className="form-description">Register to start managing your banking accounts.</p>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <Input id="register-email" label="Email address" type="email" autoComplete="email" required value={credentials.email}
        onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} />
      <Input id="register-password" label="Password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required value={credentials.password}
        onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} />
      <p className={`field-hint password-checker ${credentials.password.length >= 12 && credentials.password.length <= 72 ? 'password-checker-valid' : ''}`} aria-live="polite">
        {credentials.password.length >= 12 && credentials.password.length <= 72
          ? 'Password meets the 12–72 character requirement.'
          : `${credentials.password.length}/12 characters minimum (72 maximum)`}
      </p>
      <Button className="form-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating profile…' : 'Create profile'} <span aria-hidden="true">→</span>
      </Button>
      <p className="form-footer">Already registered? <Link to="/login">Sign in</Link></p>
    </form>
  );
}
