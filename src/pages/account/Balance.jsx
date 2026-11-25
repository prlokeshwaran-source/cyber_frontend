import { formatCurrency } from '../../utils/formatCurrency';

export function Balance({ amount, currency }) {
  return (
    <div className="balance-summary">
      <span className="account-balance-label">AVAILABLE BALANCE</span>
      <strong className="large-balance">{formatCurrency(amount, currency)}</strong>
    </div>
  );
}
