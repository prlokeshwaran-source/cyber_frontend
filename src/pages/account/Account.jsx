import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader } from '../../components/common/Loader';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { getAccount } from '../../services/accountService';
import { Balance } from './Balance';

export function Account() {
  const { accountId } = useParams();
  const { credentials } = useAuth();
  const { execute, isLoading, errorMessage } = useApi();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    let isCurrentRequest = true;
    execute(getAccount, accountId, credentials)
      .then((accountDetails) => { if (isCurrentRequest) setAccount(accountDetails); })
      .catch(() => {});
    return () => { isCurrentRequest = false; };
  }, [accountId, credentials, execute]);

  return (
    <div className="workspace-layout">
      <Sidebar />
      <section className="workspace-content">
        <p className="eyebrow">ACCOUNT DETAILS</p>
        <h1>Account</h1>
        <Link className="back-link" to="/">← Back to accounts</Link>
        {isLoading && <Loader label="Loading account details..." />}
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {account && (
          <article className="panel account-summary">
            <span className="account-currency">{account.currency} ACCOUNT</span>
            <Balance amount={account.balance} currency={account.currency} />
            <span className="eyebrow">ACCOUNT ID</span>
            <code className="account-id-full">{account.accountId}</code>
          </article>
        )}
      </section>
    </div>
  );
}
