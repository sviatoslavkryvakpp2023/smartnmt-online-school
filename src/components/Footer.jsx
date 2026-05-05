export default function Footer() {
  const appStatus = import.meta.env.VITE_APP_STATUS;
  const appVersion = import.meta.env.VITE_APP_VERSION;
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>SmartNMT — онлайн-школа підготовки до НМТ</p>
        <p>© Кривак Святослав</p>
        <p className="env-status">
          Режим: {appStatus} · Версія: {appVersion}
        </p>
      </div>
    </footer>
  );
}
