import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { checkEmail, checkUrl } from '../../services/transactionService';

export function UrlCheck() {
  const [mode, setMode] = useState('link');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState({ sender: '', subject: '', body: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setResult(null);
    try { setResult(mode === 'link' ? await checkUrl(url) : await checkEmail(email)); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  const isHighRisk = result?.riskLevel === 'HIGH';
  return <div className="workspace-layout"><Sidebar /><section className="workspace-content">
    <p className="eyebrow">SECURITY CENTER</p><h1>Phishing & spam check</h1>
    <p className="form-description">Inspect a link or email message for phishing and spam indicators before you act on it.</p>
    <div className="security-tabs" role="tablist" aria-label="Security check type">
      <button type="button" role="tab" aria-selected={mode === 'link'} className={mode === 'link' ? 'security-tab active' : 'security-tab'} onClick={() => { setMode('link'); setResult(null); setError(''); }}>Check a link</button>
      <button type="button" role="tab" aria-selected={mode === 'email'} className={mode === 'email' ? 'security-tab active' : 'security-tab'} onClick={() => { setMode('email'); setResult(null); setError(''); }}>Check an email</button>
    </div>
    <form className="panel transfer-panel" onSubmit={submit}>
      {error && <ErrorMessage message={error} />}
      {mode === 'link' ? <>
        <label htmlFor="url-check">Website URL</label>
        <input id="url-check" type="url" required maxLength="2048" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
      </> : <>
        <label htmlFor="email-sender">Sender email (optional)</label>
        <input id="email-sender" type="email" maxLength="254" placeholder="sender@example.com" value={email.sender} onChange={(e) => setEmail({ ...email, sender: e.target.value })} />
        <label htmlFor="email-subject">Subject (optional)</label>
        <input id="email-subject" maxLength="300" placeholder="Email subject" value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })} />
        <label htmlFor="email-body">Email text</label>
        <textarea id="email-body" required maxLength="20000" rows="8" placeholder="Paste the email text here. Do not include sensitive information." value={email.body} onChange={(e) => setEmail({ ...email, body: e.target.value })} />
      </>}
      <Button type="submit" disabled={busy}>{busy ? 'Checking…' : mode === 'link' ? 'Check link' : 'Check email'}</Button>
      {result && <div className={`risk-result risk-${String(result.riskLevel).toLowerCase()}`} role={isHighRisk ? 'alert' : 'status'}>
        {isHighRisk && <p className="risk-alert-banner"><span aria-hidden="true">⚠</span> DANGER — {mode === 'email' ? 'Possible phishing or spam email' : 'Potentially dangerous link'}. Do not click, reply, or share information.</p>}
        <p className="eyebrow">RISK LEVEL</p><h2>{result.riskLevel}</h2><p>Risk score: {result.riskScore}/100</p>
        {result.reasons?.length ? <ul>{result.reasons.map((reason, i) => <li key={i}>{reason}</li>)}</ul> : <p>No risk indicators were returned.</p>}
        <small>Rule-based screening can miss new threats or flag legitimate messages. Verify the sender through a trusted channel.</small>
      </div>}
    </form>
  </section></div>;
}
