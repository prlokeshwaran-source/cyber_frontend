import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { checkUrl } from '../../services/transactionService';

export function UrlCheck() {
  const [url, setUrl] = useState(''); const [result, setResult] = useState(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); setBusy(true); setError(''); setResult(null); try { setResult(await checkUrl(url)); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  return <div className="workspace-layout"><Sidebar /><section className="workspace-content"><p className="eyebrow">SECURITY CENTER</p><h1>Check a URL</h1><p className="form-description">Review a link for phishing risk before you open it.</p>
    <form className="panel transfer-panel" onSubmit={submit}>{error && <ErrorMessage message={error} />}<label htmlFor="url-check">Website URL</label><input id="url-check" type="url" required placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} /><Button type="submit" disabled={busy}>{busy ? 'Checking…' : 'Check URL'}</Button>
    {result && <div className={`risk-result risk-${String(result.riskLevel).toLowerCase()}`} role="status"><p className="eyebrow">RISK LEVEL</p><h2>{result.riskLevel}</h2><p>Risk score: {result.riskScore}</p>{result.reasons?.length ? <ul>{result.reasons.map((reason, i) => <li key={i}>{reason}</li>)}</ul> : <p>No risk indicators were returned.</p>}<small>This heuristic result does not guarantee that a URL is safe.</small></div>}</form>
  </section></div>;
}
