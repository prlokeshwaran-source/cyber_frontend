import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { createAccount } from '../../services/accountService';
import { SUPPORTED_CURRENCIES } from '../../utils/validation';

export function CreateAccount({ credentials, onAccountCreated }) {
  const [currency, setCurrency] = useState('INR');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    try {
      await createAccount({ currency }, credentials);
      setSuccessMessage(`${currency} account created.`);
      await onAccountCreated();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="create-account-form" onSubmit={handleSubmit}>
      <div className="create-account-controls">
        <div><label htmlFor="new-account-currency">Currency</label>
          <select id="new-account-currency" value={currency} onChange={(event) => setCurrency(event.target.value)}>
            {SUPPORTED_CURRENCIES.map((supportedCurrency) => <option key={supportedCurrency}>{supportedCurrency}</option>)}
          </select>
        </div>
        <Button className="secondary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : '＋ Create account'}
        </Button>
      </div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <p className="success-inline" role="status">{successMessage}</p>}
    </form>
  );
}
