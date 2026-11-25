import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';

export function AccountList({ accounts, isLoading }) {
  const navigate = useNavigate();

  if (isLoading) return <Loader label="Loading your accounts..." />;
  if (accounts.length === 0) {
    return <p className="empty-state">You don’t have any accounts yet. Create one to get started.</p>;
  }

  return (
    <div className="account-list" aria-label="Your accounts">
      {accounts.map((account) => (
        <button
          className="account-card"
          key={account.accountId}
          type="button"
          onClick={() => navigate(`/account/${encodeURIComponent(account.accountId)}`)}
        >
          <span className="account-icon" aria-hidden="true">{account.currency.slice(0, 1)}</span>
          <span className="account-details">
            <span className="account-currency">{account.currency} ACCOUNT</span>
            <span className="account-id">{account.accountId}</span>
          </span>
          <span className="account-balance">
            <span>AVAILABLE BALANCE</span>
            <strong>{formatCurrency(account.balance, account.currency)}</strong>
          </span>
        </button>
      ))}
    </div>
  );
}
