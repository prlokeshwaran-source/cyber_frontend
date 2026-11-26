import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { createAccount } from '../../services/accountService';
import { SUPPORTED_CURRENCIES } from '../../utils/validation';

export function CreateAccount({ credentials, onAccountCreated }) {
  const [currency, setCurrency] = useState('INR');
  const [initialAmount, setInitialAmount] = useState('0.00');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const amount = Number(initialAmount);
    if (!Number.isFinite(amount) || amount < 0 || !/^\d{1,17}(\.\d{1,2})?$/.test(initialAmount)) {
      setErrorMessage('Enter an initial amount of 0 or more, with up to two decimal places.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createAccount({ currency, initialAmount: amount }, credentials);
      setSuccessMessage(`${currency} account created with an initial amount of ${amount.toFixed(2)}.`);
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
        <div><label htmlFor="new-account-initial-amount">Initial amount</label>
          <input
            id="new-account-initial-amount"
            type="number"
            min="0"
            max="99999999999999999.99"
            step="0.01"
            value={initialAmount}
            onChange={(event) => setInitialAmount(event.target.value)}
            required
          />
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
