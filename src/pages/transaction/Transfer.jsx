import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader } from '../../components/common/Loader';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { getAccounts } from '../../services/accountService';
import { createTransfer } from '../../services/transactionService';
import { signCustomerTransaction } from '../../services/customerSigningService';
import { formatCurrency } from '../../utils/formatCurrency';
import { isDifferentAccount, isPositiveAmount } from '../../utils/validation';

export function Transfer() {
  const { credentials, signOut } = useAuth();
  const navigate = useNavigate();
  const { execute, isLoading: isLoadingAccounts, errorMessage: accountsError } = useApi();
  const [accounts, setAccounts] = useState([]);
  const [transferRequest, setTransferRequest] = useState({
    sourceAccountId: '',
    destinationAccountId: '',
    amount: '',
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idempotencyKey = useRef(null);

  const refreshAccounts = useCallback(async () => {
    const accountList = await execute(getAccounts, credentials);
    setAccounts(accountList);
    setTransferRequest((currentRequest) => ({
      ...currentRequest,
      sourceAccountId: accountList.some((account) => account.accountId === currentRequest.sourceAccountId)
        ? currentRequest.sourceAccountId
        : accountList[0]?.accountId || '',
    }));
  }, [credentials, execute]);

  useEffect(() => {
    refreshAccounts().catch((error) => {
      if (error.status === 401) {
        signOut();
        navigate('/login', { replace: true });
      }
    });
  }, [refreshAccounts, navigate, signOut]);

  const sourceAccount = accounts.find((account) => account.accountId === transferRequest.sourceAccountId);
  const destinationAccounts = accounts.filter((account) => account.accountId !== transferRequest.sourceAccountId);
  const isSameAccount = transferRequest.destinationAccountId.trim() !== ''
    && !isDifferentAccount(transferRequest.sourceAccountId, transferRequest.destinationAccountId);
  const isValidAmount = isPositiveAmount(transferRequest.amount);
  const canSubmit = Boolean(sourceAccount && isValidAmount && !isSameAccount && !isSubmitting);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!isValidAmount) {
      setFormError('Enter an amount greater than zero.');
      return;
    }
    if (isSameAccount) {
      setFormError('Choose a destination account different from the source account.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!window.confirm(`Authorize transfer of ${transferRequest.amount} ${sourceAccount.currency} to account ${transferRequest.destinationAccountId}?`)) return;
      // Reuse the key when retrying the same request after an uncertain failure.
      // A changed form gets a new key from its change handler below.
      idempotencyKey.current ??= crypto.randomUUID();
      const signing = await signCustomerTransaction(credentials, {
        type: 'TRANSFER', sourceAccountId: transferRequest.sourceAccountId,
        destinationAccountId: transferRequest.destinationAccountId.trim(),
        amount: transferRequest.amount, currency: sourceAccount.currency,
        operationId: idempotencyKey.current,
      });
      const transferResult = await createTransfer({
        ...transferRequest,
        amount: transferRequest.amount,
        destinationAccountId: transferRequest.destinationAccountId.trim(),
        ...signing,
      }, credentials, idempotencyKey.current);
      idempotencyKey.current = null;
      setSuccessMessage(`Transfer ${transferResult.transactionId} completed successfully.`);
      setTransferRequest((currentRequest) => ({ ...currentRequest, destinationAccountId: '', amount: '' }));
      await refreshAccounts();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="workspace-layout">
      <Sidebar />
      <section className="workspace-content">
        <p className="eyebrow">MOVE MONEY</p>
        <h1>Make a transfer</h1>
        {accountsError && <ErrorMessage message={accountsError} />}
        {isLoadingAccounts ? <Loader label="Loading your accounts..." /> : (
          <form className="panel transfer-panel" onSubmit={handleSubmit}>
            {formError && <ErrorMessage message={formError} />}
            {successMessage && <p className="success-inline" role="status">{successMessage}</p>}
            <label htmlFor="source-account">From account</label>
            <select id="source-account" required value={transferRequest.sourceAccountId}
              onChange={(event) => {
                idempotencyKey.current = null;
                setTransferRequest({
                  ...transferRequest,
                  sourceAccountId: event.target.value,
                  destinationAccountId: '',
                });
              }}>
              <option value="" disabled>Select a source account</option>
              {accounts.map((account) => (
                <option key={account.accountId} value={account.accountId}>
                  {account.currency} - {formatCurrency(account.balance, account.currency)} - {account.accountId.slice(0, 8)}
                </option>
              ))}
            </select>
            <label htmlFor="destination-account">To account</label>
            <select id="destination-account" required value={transferRequest.destinationAccountId}
              onChange={(event) => {
                idempotencyKey.current = null;
                setTransferRequest({ ...transferRequest, destinationAccountId: event.target.value });
              }}
              disabled={destinationAccounts.length === 0}>
              <option value="" disabled>Select a destination account</option>
              {destinationAccounts.map((account) => (
                <option key={account.accountId} value={account.accountId}>
                  {account.accountId} ({account.currency})
                </option>
              ))}
            </select>
            {accountsError ? <p className="field-error" role="alert">Destination accounts could not be loaded. Please try again later.</p>
              : destinationAccounts.length === 0 && <p className="field-hint">You need another account before you can make a transfer.</p>}
            <label htmlFor="transfer-amount">Amount{sourceAccount ? ` (${sourceAccount.currency})` : ''}</label>
            <input id="transfer-amount" type="number" min="0.01" step="0.01" required placeholder="0.00"
              value={transferRequest.amount}
              onChange={(event) => {
                idempotencyKey.current = null;
                setTransferRequest({ ...transferRequest, amount: event.target.value });
              }} />
            <p className="field-hint">Both accounts must use the same currency. The server checks available funds.</p>
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Processing transfer...' : 'Transfer'} <span aria-hidden="true">→</span>
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
