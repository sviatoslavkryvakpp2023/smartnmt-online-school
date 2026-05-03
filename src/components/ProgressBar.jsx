export default function ProgressBar({ value = 0 }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="progress-wrap" aria-label={`Прогрес ${safeValue}%`}>
      <div className="progress-top"><span>Прогрес</span><strong>{safeValue}%</strong></div>
      <div className="progress-line"><span style={{ width: `${safeValue}%` }} /></div>
    </div>
  );
}
