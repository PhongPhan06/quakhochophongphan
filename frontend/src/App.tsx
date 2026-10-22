
import { useEffect, useState } from 'react';
import { checkHealth } from './services/healthService';
import './App.css';

type ApiStatus = 'checking' | 'connected' | 'error';

function App() {
  const [status, setStatus] = useState<ApiStatus>('checking');
  const [message, setMessage] = useState('Đang kiểm tra backend...');

  useEffect(() => {
    let active = true;

    async function loadHealth() {
      try {
        const result = await checkHealth();

        if (!active) return;

        if (result.status === 'Healthy') {
          setStatus('connected');
          setMessage('Backend đang hoạt động bình thường.');
        } else {
          setStatus('error');
          setMessage(`Backend trả về trạng thái: ${result.status}`);
        }
      } catch {
        if (!active) return;

        setStatus('error');
        setMessage(
            'Không thể kết nối backend. Hãy kiểm tra server và cấu hình CORS.',
        );
      }
    }

    void loadHealth();

    return () => {
      active = false;
    };
  }, []);

  return (
      <main className="app">
        <section className="panel">
          <p className="eyebrow">STUDENT WEB PROJECT</p>
          <h1>Full-stack connection</h1>
          <p className="description">
            Kiểm tra kết nối giữa React và ASP.NET Core Web API.
          </p>

          <div className={`status status--${status}`} role="status">
            <span className="status__dot" />
            <span>
            {status === 'checking'
                ? 'Đang kiểm tra'
                : status === 'connected'
                    ? 'Đã kết nối'
                    : 'Kết nối thất bại'}
          </span>
          </div>

          <p className="message">{message}</p>

          <div className="details">
            <div>
              <span>Frontend</span>
              <strong>React + TypeScript</strong>
            </div>
            <div>
              <span>Backend</span>
              <strong>ASP.NET Core</strong>
            </div>
            <div>
              <span>Endpoint</span>
              <strong>GET /api/health</strong>
            </div>
          </div>

          <button
              type="button"
              onClick={() => window.location.reload()}
          >
            Kiểm tra lại
          </button>
        </section>
      </main>
  );
}

export default App;
