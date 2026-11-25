export function Loader({ label = 'Loading...' }) {
  return <p className="loading-state" role="status"><span className="loader-spinner" aria-hidden="true" />{label}</p>;
}
