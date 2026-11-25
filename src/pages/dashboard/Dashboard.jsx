import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { getAccounts } from '../../services/accountService';
import { AccountList } from '../account/AccountList';
import { CreateAccount } from '../account/CreateAccount';

export function Dashboard() {
  const { credentials, signOut } = useAuth();
  const navigate = useNavigate();
  const { execute, isLoading, errorMessage } = useApi();
  const [accounts, setAccounts] = useState([]);

  const refreshAccounts = useCallback(async () => {
    try {
      const accountList = await execute(getAccounts, credentials);
      setAccounts(accountList);
    } catch (error) {
      if (error.status === 401) {
        signOut();
        navigate('/login', { replace: true });
      }
    }
  }, [credentials, execute, navigate, signOut]);

  useEffect(() => { void refreshAccounts(); }, [refreshAccounts]);

  return (
    <div className="workspace-layout">
      <Sidebar />
      <section className="workspace-content">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">YOUR OVERVIEW</p>
            <h1>Bank accounts</h1>
            <p className="dashboard-email">Signed in as {credentials.email}</p>
          </div>
          <button className="icon-button" type="button" onClick={() => void refreshAccounts()} disabled={isLoading} aria-label="Refresh account list">↻</button>
        </div>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <div className="panel accounts-panel">
          <div className="panel-heading"><div><p className="eyebrow">ACCOUNTS</p><h2>Your accounts</h2></div></div>
          <AccountList accounts={accounts} isLoading={isLoading} />
          <CreateAccount credentials={credentials} onAccountCreated={refreshAccounts} />
        </div>
        <aside className="funding-note">
          <span className="info-icon">i</span>
          <p><strong>Account funding</strong> The backend doesn’t provide deposits or withdrawals. Newly created accounts start at zero; transfers require an account funded through a test fixture.</p>
        </aside>
      </section>
    </div>
  );
}
