import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Input } from '../../components/common/Input';
import { approveDevice } from '../../services/authService';

export function DeviceApproval() {
  const [challenge, setChallenge] = useState({ challengeId: '', code: '' });
  const [decision, setDecision] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try { const result = await approveDevice(challenge, decision); setMessage(result?.message || `This device was ${decision ? 'approved' : 'denied'}.`); }
    catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }
  return <form className="form-card" onSubmit={submit}>
    <p className="eyebrow">DEVICE SECURITY</p><h1>Approve a device</h1>
    <p className="form-description">Enter the challenge ID and code from the approval email. Codes expire after 10 minutes and allow five attempts.</p>
    {error && <ErrorMessage message={error} />}{message && <p className="success-inline" role="status">{message}</p>}
    <Input id="challenge-id" label="Challenge ID" required value={challenge.challengeId} onChange={(event) => setChallenge({ ...challenge, challengeId: event.target.value })} />
    <Input id="challenge-code" label="Email code" required autoComplete="one-time-code" value={challenge.code} onChange={(event) => setChallenge({ ...challenge, code: event.target.value })} />
    <label className="decision-field"><input type="checkbox" checked={decision} onChange={(event) => setDecision(event.target.checked)} /> Approve this device</label>
    <Button className="form-submit" type="submit" disabled={busy}>{busy ? 'Submitting…' : decision ? 'Approve device' : 'Deny device'}</Button>
    <p className="form-footer"><Link to="/login">Return to sign in</Link></p>
  </form>;
}
