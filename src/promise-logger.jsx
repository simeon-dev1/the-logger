import { useState, useEffect } from "react";

const STORAGE_KEY = "simeon-covenant-book";

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&family=IM+Fell+English:ital@0;1&display=swap');
`;

export default function PromiseLogger() {
  const [promises, setPromises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ person: "", whatTheyDid: "", whatIPromised: "", date: new Date().toISOString().split("T")[0] });
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [fulfilled, setFulfilled] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPromises(parsed.promises || []);
        setFulfilled(parsed.fulfilled || {});
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ promises, fulfilled }));
    }
  }, [promises, fulfilled, loaded]);

  const addPromise = () => {
    if (!form.person.trim() || !form.whatIPromised.trim()) return;
    const entry = { ...form, id: Date.now(), addedAt: new Date().toISOString() };
    setPromises(prev => [entry, ...prev]);
    setForm({ person: "", whatTheyDid: "", whatIPromised: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
  };

  const toggleFulfilled = (id) => {
    setFulfilled(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const deletePromise = (id) => {
    setPromises(prev => prev.filter(p => p.id !== id));
    setSelected(null);
  };

  const pending = promises.filter(p => !fulfilled[p.id]);
  const done = promises.filter(p => fulfilled[p.id]);

  return (
    <>
      <style>{fonts}</style>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { background: #0a0804; }

        .app {
          min-height: 100vh;
          background: #0c0a07;
          background-image: 
            radial-gradient(ellipse at 20% 20%, rgba(180, 140, 60, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(120, 80, 20, 0.06) 0%, transparent 60%);
          color: #e8d9b0;
          font-family: 'Cormorant Garamond', serif;
          position: relative;
          overflow-x: hidden;
        }

        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        .header {
          text-align: center;
          padding: 60px 24px 40px;
          border-bottom: 1px solid rgba(180, 140, 60, 0.15);
          position: relative;
        }

        .header::before {
          content: '✦';
          display: block;
          font-size: 12px;
          color: rgba(180, 140, 60, 0.5);
          margin-bottom: 20px;
          letter-spacing: 8px;
        }

        .title {
          font-family: 'Cinzel', serif;
          font-size: clamp(22px, 5vw, 36px);
          font-weight: 600;
          color: #c9a84c;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .subtitle {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 15px;
          color: rgba(232, 217, 176, 0.45);
          letter-spacing: 1px;
        }

        .ornament {
          margin-top: 20px;
          font-size: 11px;
          color: rgba(180, 140, 60, 0.3);
          letter-spacing: 12px;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 48px;
          padding: 28px 24px;
          border-bottom: 1px solid rgba(180, 140, 60, 0.08);
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          color: #c9a84c;
          display: block;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(232, 217, 176, 0.35);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .add-btn {
          display: block;
          margin: 32px auto;
          background: transparent;
          border: 1px solid rgba(180, 140, 60, 0.4);
          color: #c9a84c;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 14px 36px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .add-btn:hover {
          background: rgba(180, 140, 60, 0.08);
          border-color: rgba(180, 140, 60, 0.7);
          box-shadow: 0 0 20px rgba(180, 140, 60, 0.1);
        }

        .form-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 6, 4, 0.92);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          backdrop-filter: blur(4px);
        }

        .form-box {
          background: #111009;
          border: 1px solid rgba(180, 140, 60, 0.25);
          padding: 40px;
          width: 100%;
          max-width: 520px;
          position: relative;
        }

        .form-box::before {
          content: '';
          position: absolute;
          top: 6px; left: 6px; right: 6px; bottom: 6px;
          border: 1px solid rgba(180, 140, 60, 0.08);
          pointer-events: none;
        }

        .form-title {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 32px;
          text-align: center;
        }

        .field {
          margin-bottom: 20px;
        }

        .field label {
          display: block;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(180, 140, 60, 0.6);
          margin-bottom: 8px;
          font-family: 'Cinzel', serif;
        }

        .field input, .field textarea {
          width: 100%;
          background: rgba(180, 140, 60, 0.04);
          border: none;
          border-bottom: 1px solid rgba(180, 140, 60, 0.2);
          color: #e8d9b0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          padding: 8px 4px;
          outline: none;
          transition: border-color 0.2s;
          resize: none;
        }

        .field input:focus, .field textarea:focus {
          border-bottom-color: rgba(180, 140, 60, 0.6);
        }

        .field input::placeholder, .field textarea::placeholder {
          color: rgba(232, 217, 176, 0.2);
          font-style: italic;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn-seal {
          flex: 1;
          background: rgba(180, 140, 60, 0.12);
          border: 1px solid rgba(180, 140, 60, 0.4);
          color: #c9a84c;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-seal:hover {
          background: rgba(180, 140, 60, 0.2);
        }

        .btn-cancel {
          background: transparent;
          border: 1px solid rgba(232, 217, 176, 0.1);
          color: rgba(232, 217, 176, 0.3);
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 13px 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel:hover {
          border-color: rgba(232, 217, 176, 0.2);
          color: rgba(232, 217, 176, 0.5);
        }

        .section-label {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(180, 140, 60, 0.35);
          padding: 0 24px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(180, 140, 60, 0.1);
        }

        .promise-list {
          padding: 0 16px;
          max-width: 720px;
          margin: 0 auto;
        }

        .promise-card {
          border: 1px solid rgba(180, 140, 60, 0.12);
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          background: rgba(180, 140, 60, 0.02);
        }

        .promise-card:hover {
          border-color: rgba(180, 140, 60, 0.3);
          background: rgba(180, 140, 60, 0.05);
        }

        .promise-card.fulfilled {
          opacity: 0.45;
          border-color: rgba(180, 140, 60, 0.06);
        }

        .promise-card.fulfilled .person-name {
          text-decoration: line-through;
          text-decoration-color: rgba(180, 140, 60, 0.4);
        }

        .card-inner {
          padding: 20px 24px;
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .person-name {
          font-family: 'Cinzel', serif;
          font-size: 15px;
          color: #c9a84c;
          letter-spacing: 1px;
        }

        .card-date {
          font-size: 11px;
          color: rgba(232, 217, 176, 0.25);
          letter-spacing: 1px;
          margin-top: 2px;
        }

        .promise-preview {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 15px;
          color: rgba(232, 217, 176, 0.65);
          line-height: 1.5;
          margin-top: 6px;
        }

        .fulfilled-badge {
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(100, 180, 100, 0.6);
          font-family: 'Cinzel', serif;
          border: 1px solid rgba(100, 180, 100, 0.2);
          padding: 3px 8px;
          margin-top: 4px;
        }

        .detail-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 6, 4, 0.94);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          backdrop-filter: blur(4px);
        }

        .detail-box {
          background: #0f0d09;
          border: 1px solid rgba(180, 140, 60, 0.25);
          padding: 44px;
          width: 100%;
          max-width: 560px;
          position: relative;
        }

        .detail-box::before {
          content: '';
          position: absolute;
          top: 6px; left: 6px; right: 6px; bottom: 6px;
          border: 1px solid rgba(180, 140, 60, 0.07);
          pointer-events: none;
        }

        .detail-person {
          font-family: 'Cinzel', serif;
          font-size: 22px;
          color: #c9a84c;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }

        .detail-date {
          font-size: 12px;
          color: rgba(232, 217, 176, 0.3);
          letter-spacing: 2px;
          margin-bottom: 32px;
          text-transform: uppercase;
          font-family: 'Cinzel', serif;
        }

        .detail-section {
          margin-bottom: 24px;
        }

        .detail-section-label {
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(180, 140, 60, 0.5);
          font-family: 'Cinzel', serif;
          margin-bottom: 8px;
        }

        .detail-text {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 17px;
          color: rgba(232, 217, 176, 0.8);
          line-height: 1.7;
        }

        .divider {
          height: 1px;
          background: rgba(180, 140, 60, 0.1);
          margin: 28px 0;
        }

        .detail-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-fulfill {
          flex: 1;
          min-width: 120px;
          background: transparent;
          border: 1px solid rgba(100, 180, 100, 0.3);
          color: rgba(100, 180, 100, 0.7);
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 11px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-fulfill:hover {
          background: rgba(100, 180, 100, 0.08);
          border-color: rgba(100, 180, 100, 0.5);
        }

        .btn-unfulfill {
          flex: 1;
          min-width: 120px;
          background: transparent;
          border: 1px solid rgba(180, 140, 60, 0.3);
          color: rgba(180, 140, 60, 0.6);
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 11px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-delete {
          background: transparent;
          border: 1px solid rgba(180, 60, 60, 0.2);
          color: rgba(180, 80, 80, 0.4);
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 11px 16px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-delete:hover {
          border-color: rgba(180, 60, 60, 0.4);
          color: rgba(180, 80, 80, 0.7);
        }

        .btn-close {
          background: transparent;
          border: 1px solid rgba(232, 217, 176, 0.1);
          color: rgba(232, 217, 176, 0.3);
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 2px;
          padding: 11px 16px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .empty-state {
          text-align: center;
          padding: 80px 24px;
        }

        .empty-glyph {
          font-size: 32px;
          color: rgba(180, 140, 60, 0.15);
          margin-bottom: 20px;
          font-family: 'Cinzel', serif;
        }

        .empty-text {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 17px;
          color: rgba(232, 217, 176, 0.25);
          line-height: 1.8;
        }

        .footer-quote {
          text-align: center;
          padding: 48px 24px 60px;
          margin-top: 40px;
          border-top: 1px solid rgba(180, 140, 60, 0.08);
        }

        .quote-text {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 14px;
          color: rgba(232, 217, 176, 0.2);
          letter-spacing: 0.5px;
          line-height: 1.8;
        }
      `}</style>

      <div className="app">
        <div className="grain" />

        <header className="header">
          <div className="title">The Covenant Book</div>
          <div className="subtitle">A record of debts owed in gratitude</div>
          <div className="ornament">✦ ✦ ✦</div>
        </header>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-number">{promises.length}</span>
            <span className="stat-label">Recorded</span>
          </div>
          <div className="stat">
            <span className="stat-number">{pending.length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-number">{done.length}</span>
            <span className="stat-label">Fulfilled</span>
          </div>
        </div>

        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Seal a Promise
        </button>

        <div className="promise-list">
          {promises.length === 0 && (
            <div className="empty-state">
              <div className="empty-glyph">✦</div>
              <div className="empty-text">
                The ledger is empty.<br />
                Seal your first covenant.
              </div>
            </div>
          )}

          {pending.length > 0 && (
            <>
              <div className="section-label">Pending Promises</div>
              {pending.map(p => (
                <div key={p.id} className="promise-card" onClick={() => setSelected(p)}>
                  <div className="card-inner">
                    <div className="card-top">
                      <div>
                        <div className="person-name">{p.person}</div>
                        <div className="card-date">{p.date}</div>
                      </div>
                    </div>
                    <div className="promise-preview">"{p.whatIPromised}"</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {done.length > 0 && (
            <>
              <div className="section-label" style={{ marginTop: 32 }}>Fulfilled</div>
              {done.map(p => (
                <div key={p.id} className="promise-card fulfilled" onClick={() => setSelected(p)}>
                  <div className="card-inner">
                    <div className="card-top">
                      <div>
                        <div className="person-name">{p.person}</div>
                        <div className="card-date">{p.date}</div>
                      </div>
                      <div className="fulfilled-badge">Fulfilled</div>
                    </div>
                    <div className="promise-preview">"{p.whatIPromised}"</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="footer-quote">
          <div className="quote-text">
            "Only those who work hard will eat."<br />
            — and only those who remember, will repay.
          </div>
        </div>

        {showForm && (
          <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <div className="form-box">
              <div className="form-title">Seal a Promise</div>
              <div className="field">
                <label>Person</label>
                <input
                  placeholder="Who showed up for you?"
                  value={form.person}
                  onChange={e => setForm(f => ({ ...f, person: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>What they did</label>
                <textarea
                  rows={3}
                  placeholder="What small or large thing did they do?"
                  value={form.whatTheyDid}
                  onChange={e => setForm(f => ({ ...f, whatTheyDid: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Your Promise *</label>
                <textarea
                  rows={3}
                  placeholder="What do you promise to give back one day?"
                  value={form.whatIPromised}
                  onChange={e => setForm(f => ({ ...f, whatIPromised: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn-seal" onClick={addPromise}>Seal the Promise</button>
              </div>
            </div>
          </div>
        )}

        {selected && (
          <div className="detail-overlay" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
            <div className="detail-box">
              <div className="detail-person">{selected.person}</div>
              <div className="detail-date">{selected.date}</div>

              {selected.whatTheyDid && (
                <div className="detail-section">
                  <div className="detail-section-label">What they did</div>
                  <div className="detail-text">{selected.whatTheyDid}</div>
                </div>
              )}

              <div className="divider" />

              <div className="detail-section">
                <div className="detail-section-label">Your Promise</div>
                <div className="detail-text">"{selected.whatIPromised}"</div>
              </div>

              <div className="divider" />

              <div className="detail-actions">
                {fulfilled[selected.id] ? (
                  <button className="btn-unfulfill" onClick={() => toggleFulfilled(selected.id)}>
                    Mark Pending
                  </button>
                ) : (
                  <button className="btn-fulfill" onClick={() => { toggleFulfilled(selected.id); setSelected(null); }}>
                    Mark Fulfilled
                  </button>
                )}
                <button className="btn-delete" onClick={() => deletePromise(selected.id)}>Delete</button>
                <button className="btn-close" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
