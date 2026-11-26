import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader } from '../../components/common/Loader';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { getAccounts } from '../../services/accountService';
import { createDeposit, createWithdrawal, getTransactions } from '../../services/transactionService';
import { verifyTransaction } from '../../services/transactionService';
import { signCustomerTransaction } from '../../services/customerSigningService';
import { formatCurrency } from '../../utils/formatCurrency';
import { isPositiveAmount } from '../../utils/validation';

export function Activity() {
  const { credentials, signOut } = useAuth(); const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]); const [transactions, setTransactions] = useState([]);
  const [accountId, setAccountId] = useState(''); const [amount, setAmount] = useState('');
  const [kind, setKind] = useState('deposit'); const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  const [verification, setVerification] = useState({});
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { const [accountRows, transactionRows] = await Promise.all([getAccounts(credentials), getTransactions(credentials)]); setAccounts(accountRows); setTransactions(transactionRows); setAccountId((current) => accountRows.some((a) => a.accountId === current) ? current : accountRows[0]?.accountId || ''); }
    catch (e) { if (e.status === 401) { signOut(); navigate('/login', { replace: true }); } else setError(e.message); }
    finally { setLoading(false); }
  }, [credentials, navigate, signOut]);
  useEffect(() => { void refresh(); }, [refresh]);
  async function submit(event) {
    event.preventDefault(); setError(''); setNotice('');
    if (!isPositiveAmount(amount)) { setError('Enter an amount greater than zero.'); return; }
    setBusy(true);
    try {
      const account = accounts.find((row) => row.accountId === accountId);
      const key = crypto.randomUUID();
      const type = kind === 'deposit' ? 'DEPOSIT' : 'WITHDRAWAL';
      if (!window.confirm(`Authorize ${kind} of ${amount} ${account.currency} for account ${accountId}?`)) return;
      const signing = await signCustomerTransaction(credentials, {
        type, sourceAccountId: kind === 'withdrawal' ? accountId : null,
        destinationAccountId: kind === 'deposit' ? accountId : null,
        amount, currency: account.currency, operationId: key,
      });
      const request = { accountId, amount, ...signing };
      const result = kind === 'deposit' ? await createDeposit(request, credentials, key) : await createWithdrawal(request, credentials, key);
      setNotice(`${kind === 'deposit' ? 'Deposit' : 'Withdrawal'} recorded: ${result.transactionId}`); setAmount(''); await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function checkSignature(transactionId) {
    try {
      const result = await verifyTransaction(transactionId, credentials);
      setVerification((current) => ({ ...current, [transactionId]: result }));
    } catch (e) { setError(e.message); }
  }
  return <div className="workspace-layout"><Sidebar /><section className="workspace-content">
    <p className="eyebrow">ACCOUNT ACTIVITY</p><h1>Deposits, withdrawals & history</h1>
    <aside className="funding-note"><span className="info-icon">i</span><p><strong>Demo deposits</strong> Deposit requests credit the balance directly. They are not connected to a funding provider and must not be used for real deposits.</p></aside>
    {error && <ErrorMessage message={error} />}{notice && <p className="success-inline" role="status">{notice}</p>}
    <form className="panel transfer-panel" onSubmit={submit}>
      <div className="activity-kind"><label><input type="radio" name="kind" checked={kind === 'deposit'} onChange={() => setKind('deposit')} /> Deposit</label><label><input type="radio" name="kind" checked={kind === 'withdrawal'} onChange={() => setKind('withdrawal')} /> Withdraw</label></div>
      <label htmlFor="activity-account">Account</label><select id="activity-account" required value={accountId} onChange={(e) => setAccountId(e.target.value)}>{accounts.map((a) => <option key={a.accountId} value={a.accountId}>{a.currency} · {a.accountId.slice(0, 12)} · {formatCurrency(a.balance, a.currency)}</option>)}</select>
      <label htmlFor="activity-amount">Amount</label><input id="activity-amount" type="number" min="0.01" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
      <Button type="submit" disabled={busy || !accountId}>{busy ? 'Processing…' : kind === 'deposit' ? 'Deposit funds' : 'Withdraw funds'}</Button>
    </form>
    <div className="panel history-panel"><div className="panel-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Transactions</h2></div><button className="text-button" type="button" onClick={() => void refresh()}>Refresh</button></div>
      {loading ? <Loader label="Loading transactions…" /> : transactions.length === 0 ? <p className="empty-state">No transactions yet.</p> : <div className="transaction-list">{transactions.map((tx) => { const txId = tx.transactionId || tx.id; return <article className="transaction-row" key={txId}><div><strong>{tx.type}</strong><span>{new Date(tx.createdAt).toLocaleString()}</span><code>{tx.sourceAccountId || 'External'} → {tx.destinationAccountId || 'External'}</code>{verification[txId] && <span role="status">{verification[txId].valid ? 'Both signatures verified' : 'Signature verification failed'}</span>}<button className="text-button" type="button" onClick={() => void checkSignature(txId)}>Verify signatures</button></div><strong>{formatCurrency(tx.amount, tx.currency)}</strong></article>; })}</div>}
    </div>
  </section></div>;
}
