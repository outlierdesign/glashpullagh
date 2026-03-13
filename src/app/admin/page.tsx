'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  role: string;
}

interface ContentData {
  [key: string]: any;
}

const SECTION_CONFIG = [
  { key: 'hero', label: 'Hero Section', icon: '◆', desc: 'Main hero with WebGL water ripple' },
  { key: 'bento', label: 'Story Grid', icon: '▦', desc: '8-panel bento layout with images and text' },
  { key: 'comparison', label: 'Before / After', icon: '⇄', desc: 'Drag-to-compare restoration slider' },
  { key: 'stats', label: 'Statistics', icon: '▤', desc: 'Counter banner with key numbers' },
  { key: 'aboutSite', label: 'About the Site', icon: '◎', desc: 'Site description, images, conditions' },
  { key: 'restoration', label: 'Restoration Actions', icon: '⬡', desc: '7 restoration technique cards' },
  { key: 'monitoring', label: 'Monitoring', icon: '◉', desc: 'Evidence and measurement section' },
  { key: 'videos', label: 'Video Gallery', icon: '▶', desc: '9 video cards with lightbox' },
  { key: 'film', label: 'Documentary', icon: '◧', desc: 'Featured documentary embed' },
  { key: 'gallery', label: 'Photo Gallery', icon: '▣', desc: 'Offset image gallery' },
  { key: 'footer', label: 'Footer', icon: '▬', desc: 'Closing statement and credits' },
  { key: 'meta', label: 'SEO & Meta', icon: '⚙', desc: 'Page title and description' },
];

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState<ContentData>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.ok ? r.json() : null),
      fetch('/api/content').then(r => r.json())
    ]).then(([authData, contentData]) => {
      if (!authData?.user) {
        router.push('/admin/login');
        return;
      }
      setUser(authData.user);
      setContent(contentData);
      setLoading(false);
    }).catch(() => router.push('/admin/login'));
  }, [router]);

  function openSection(key: string) {
    setActiveSection(key);
    setEditData(JSON.parse(JSON.stringify(content[key] || {})));
    setSaved(false);
  }

  async function saveSection() {
    if (!activeSection || !editData) return;
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: activeSection, data: editData })
      });
      if (res.ok) {
        const { content: updated } = await res.json();
        setContent(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  function updateField(path: string, value: any) {
    const keys = path.split('.');
    const updated = JSON.parse(JSON.stringify(editData));
    let obj = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (k.match(/^\d+$/)) {
        obj = obj[parseInt(k)];
      } else {
        obj = obj[k];
      }
    }
    const lastKey = keys[keys.length - 1];
    if (lastKey.match(/^\d+$/)) {
      obj[parseInt(lastKey)] = value;
    } else {
      obj[lastKey] = value;
    }
    setEditData(updated);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0E0B09', color: '#B8864A', fontFamily: 'Proza Libre, sans-serif' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #0E0B09;
          font-family: 'Inter', -apple-system, sans-serif;
          color: #E4DDD2;
          display: grid;
          grid-template-columns: 300px 1fr;
        }

        /* ---- SIDEBAR ---- */
        .admin-sidebar {
          background: #151110;
          border-right: 1px solid rgba(184,134,74,0.08);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(184,134,74,0.08);
        }
        .sidebar-brand {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.1rem;
          color: #CDA06A;
          font-weight: 400;
        }
        .sidebar-sub {
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #6B6860;
          margin-top: 0.25rem;
        }
        .sidebar-sections {
          flex: 1;
          padding: 0.75rem 0;
        }
        .sidebar-section-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1.5rem;
          background: transparent;
          border: none;
          color: #A09B91;
          font-family: inherit;
          font-size: 0.82rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s;
        }
        .sidebar-section-btn:hover {
          background: rgba(184,134,74,0.04);
          color: #E4DDD2;
        }
        .sidebar-section-btn.active {
          background: rgba(184,134,74,0.08);
          color: #CDA06A;
          border-right: 2px solid #B8864A;
        }
        .sidebar-section-icon {
          width: 24px;
          text-align: center;
          font-size: 0.9rem;
          opacity: 0.6;
        }
        .sidebar-section-label {
          font-weight: 500;
        }
        .sidebar-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(184,134,74,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sidebar-user {
          font-size: 0.75rem;
          color: #6B6860;
        }
        .sidebar-logout {
          background: transparent;
          border: 1px solid rgba(184,134,74,0.15);
          color: #A09B91;
          font-family: inherit;
          font-size: 0.7rem;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .sidebar-logout:hover {
          border-color: rgba(184,134,74,0.3);
          color: #E4DDD2;
        }

        /* ---- MAIN CONTENT ---- */
        .admin-main {
          padding: 2rem 3rem;
          max-width: 900px;
        }
        .admin-welcome {
          margin-bottom: 2rem;
        }
        .admin-welcome h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.8rem;
          font-weight: 400;
          color: #CDA06A;
          margin-bottom: 0.5rem;
        }
        .admin-welcome p {
          color: #6B6860;
          font-size: 0.85rem;
        }

        /* ---- SECTION EDITOR ---- */
        .editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(184,134,74,0.08);
        }
        .editor-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem;
          color: #CDA06A;
          font-weight: 400;
        }
        .editor-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .btn-save {
          padding: 0.6rem 1.5rem;
          background: #B8864A;
          border: none;
          border-radius: 8px;
          color: #0E0B09;
          font-family: inherit;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-save:hover { background: #CDA06A; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-save.saved { background: #3A5238; color: #96A888; }
        .btn-back {
          padding: 0.6rem 1.2rem;
          background: transparent;
          border: 1px solid rgba(184,134,74,0.15);
          border-radius: 8px;
          color: #A09B91;
          font-family: inherit;
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-back:hover {
          border-color: rgba(184,134,74,0.3);
          color: #E4DDD2;
        }

        /* ---- FIELD GROUPS ---- */
        .field-group {
          margin-bottom: 1.5rem;
        }
        .field-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6B6860;
          margin-bottom: 0.4rem;
        }
        .field-input {
          width: 100%;
          padding: 0.65rem 0.9rem;
          background: #1C1714;
          border: 1px solid rgba(184,134,74,0.1);
          border-radius: 8px;
          color: #E4DDD2;
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .field-input:focus {
          border-color: rgba(184,134,74,0.35);
        }
        .field-textarea {
          min-height: 100px;
          resize: vertical;
          line-height: 1.6;
        }
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .card-editor {
          background: #151110;
          border: 1px solid rgba(184,134,74,0.06);
          border-radius: 10px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        .card-editor-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.82rem;
          color: #B8864A;
          font-weight: 500;
        }
        .card-num {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(184,134,74,0.1);
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #B8864A;
        }

        /* ---- OVERVIEW GRID ---- */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .overview-card {
          background: #151110;
          border: 1px solid rgba(184,134,74,0.06);
          border-radius: 10px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .overview-card:hover {
          border-color: rgba(184,134,74,0.2);
          background: #1C1714;
        }
        .overview-card-icon {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          opacity: 0.5;
        }
        .overview-card-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #CDA06A;
          margin-bottom: 0.25rem;
        }
        .overview-card-desc {
          font-size: 0.75rem;
          color: #6B6860;
        }

        /* ---- VIEW SITE LINK ---- */
        .view-site-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding: 0.5rem 1rem;
          background: rgba(184,134,74,0.06);
          border: 1px solid rgba(184,134,74,0.1);
          border-radius: 8px;
          font-size: 0.78rem;
          color: #A09B91;
          text-decoration: none;
          transition: all 0.15s;
        }
        .view-site-link:hover {
          border-color: rgba(184,134,74,0.25);
          color: #CDA06A;
        }

        @media (max-width: 768px) {
          .admin-dashboard { grid-template-columns: 1fr; }
          .admin-sidebar { position: fixed; z-index: 100; width: 280px; transform: translateX(-100%); }
          .admin-main { padding: 1.5rem; }
          .overview-grid { grid-template-columns: 1fr; }
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">Glashapullagh</div>
          <div className="sidebar-sub">Content Editor</div>
        </div>
        <nav className="sidebar-sections">
          {SECTION_CONFIG.map(s => (
            <button
              key={s.key}
              className={`sidebar-section-btn ${activeSection === s.key ? 'active' : ''}`}
              onClick={() => openSection(s.key)}
            >
              <span className="sidebar-section-icon">{s.icon}</span>
              <span className="sidebar-section-label">{s.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-user">{user?.email}</span>
          <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {!activeSection ? (
          <>
            <div className="admin-welcome">
              <h2>Welcome back</h2>
              <p>Select a section to edit, or browse the overview below.</p>
            </div>
            <div className="overview-grid">
              {SECTION_CONFIG.map(s => (
                <div key={s.key} className="overview-card" onClick={() => openSection(s.key)}>
                  <div className="overview-card-icon">{s.icon}</div>
                  <div className="overview-card-label">{s.label}</div>
                  <div className="overview-card-desc">{s.desc}</div>
                </div>
              ))}
            </div>
            <a href="/" target="_blank" className="view-site-link">
              View live site →
            </a>
          </>
        ) : (
          <>
            <div className="editor-header">
              <h2 className="editor-title">
                {SECTION_CONFIG.find(s => s.key === activeSection)?.label}
              </h2>
              <div className="editor-actions">
                <button className="btn-back" onClick={() => setActiveSection(null)}>← Back</button>
                <button
                  className={`btn-save ${saved ? 'saved' : ''}`}
                  onClick={saveSection}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Dynamic editor based on section type */}
            {renderSectionEditor(activeSection, editData, updateField)}
          </>
        )}
      </main>
    </div>
  );
}

function renderSectionEditor(section: string, data: any, update: (path: string, val: any) => void) {
  if (!data) return <p style={{ color: '#6B6860' }}>No content data for this section yet.</p>;

  switch (section) {
    case 'meta':
      return (
        <>
          <div className="field-group">
            <label className="field-label">Page Title</label>
            <input className="field-input" value={data.title || ''} onChange={e => update('title', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Meta Description</label>
            <textarea className="field-input field-textarea" value={data.description || ''} onChange={e => update('description', e.target.value)} />
          </div>
        </>
      );

    case 'hero':
      return (
        <>
          <div className="field-group">
            <label className="field-label">Label</label>
            <input className="field-input" value={data.label || ''} onChange={e => update('label', e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Title Line 1</label>
              <input className="field-input" value={data.titleLine1 || ''} onChange={e => update('titleLine1', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Title Line 2</label>
              <input className="field-input" value={data.titleLine2 || ''} onChange={e => update('titleLine2', e.target.value)} />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Subtitle</label>
            <textarea className="field-input field-textarea" value={data.subtitle || ''} onChange={e => update('subtitle', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Hero Image Path</label>
            <input className="field-input" value={data.image || ''} onChange={e => update('image', e.target.value)} />
          </div>
        </>
      );

    case 'stats':
      return (
        <>
          {(data || []).map((stat: any, i: number) => (
            <div key={i} className="card-editor">
              <div className="card-editor-header">
                <span className="card-num">{i + 1}</span>
                {stat.label}
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Value</label>
                  <input className="field-input" type="number" value={stat.value || 0} onChange={e => update(`${i}.value`, parseInt(e.target.value))} />
                </div>
                <div className="field-group">
                  <label className="field-label">Suffix</label>
                  <input className="field-input" value={stat.suffix || ''} onChange={e => update(`${i}.suffix`, e.target.value)} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Label</label>
                <input className="field-input" value={stat.label || ''} onChange={e => update(`${i}.label`, e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Description</label>
                <input className="field-input" value={stat.desc || ''} onChange={e => update(`${i}.desc`, e.target.value)} />
              </div>
            </div>
          ))}
        </>
      );

    case 'comparison':
      return (
        <>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Before Image Path</label>
              <input className="field-input" value={data.beforeImage || ''} onChange={e => update('beforeImage', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">After Image Path</label>
              <input className="field-input" value={data.afterImage || ''} onChange={e => update('afterImage', e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Before Label</label>
              <input className="field-input" value={data.beforeLabel || ''} onChange={e => update('beforeLabel', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">After Label</label>
              <input className="field-input" value={data.afterLabel || ''} onChange={e => update('afterLabel', e.target.value)} />
            </div>
          </div>
        </>
      );

    case 'restoration':
      return (
        <>
          <div className="field-group">
            <label className="field-label">Section Title</label>
            <input className="field-input" value={data.title || ''} onChange={e => update('title', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Lead Text</label>
            <textarea className="field-input field-textarea" value={data.lead || ''} onChange={e => update('lead', e.target.value)} />
          </div>
          {(data.cards || []).map((card: any, i: number) => (
            <div key={i} className="card-editor">
              <div className="card-editor-header">
                <span className="card-num">{card.num}</span>
                {card.title}
              </div>
              <div className="field-group">
                <label className="field-label">Title</label>
                <input className="field-input" value={card.title || ''} onChange={e => update(`cards.${i}.title`, e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Body</label>
                <textarea className="field-input field-textarea" value={card.body || ''} onChange={e => update(`cards.${i}.body`, e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Technical Detail</label>
                <textarea className="field-input field-textarea" value={card.detail || ''} onChange={e => update(`cards.${i}.detail`, e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Image Path</label>
                <input className="field-input" value={card.image || ''} onChange={e => update(`cards.${i}.image`, e.target.value)} />
              </div>
            </div>
          ))}
        </>
      );

    case 'videos':
      return (
        <>
          <div className="field-group">
            <label className="field-label">Section Title</label>
            <input className="field-input" value={data.title || ''} onChange={e => update('title', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Lead Text</label>
            <textarea className="field-input field-textarea" value={data.lead || ''} onChange={e => update('lead', e.target.value)} />
          </div>
          {(data.items || []).map((vid: any, i: number) => (
            <div key={i} className="card-editor">
              <div className="card-editor-header">
                <span className="card-num">{i + 1}</span>
                {vid.title}
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Title</label>
                  <input className="field-input" value={vid.title || ''} onChange={e => update(`items.${i}.title`, e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="field-label">Description</label>
                  <input className="field-input" value={vid.desc || ''} onChange={e => update(`items.${i}.desc`, e.target.value)} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Video URL (YouTube embed)</label>
                <input className="field-input" value={vid.videoUrl || ''} onChange={e => update(`items.${i}.videoUrl`, e.target.value)} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div className="field-group">
                <label className="field-label">Thumbnail Path</label>
                <input className="field-input" value={vid.thumbnail || ''} onChange={e => update(`items.${i}.thumbnail`, e.target.value)} />
              </div>
            </div>
          ))}
        </>
      );

    case 'footer':
      return (
        <>
          <div className="field-group">
            <label className="field-label">Closing Title</label>
            <input className="field-input" value={data.closing?.title || ''} onChange={e => update('closing.title', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Closing Body</label>
            <textarea className="field-input field-textarea" value={data.closing?.body || ''} onChange={e => update('closing.body', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Organization Name</label>
            <input className="field-input" value={data.org || ''} onChange={e => update('org', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Copyright Text</label>
            <input className="field-input" value={data.copyright || ''} onChange={e => update('copyright', e.target.value)} />
          </div>
        </>
      );

    default:
      return (
        <div style={{ color: '#6B6860', fontSize: '0.85rem' }}>
          <p>Raw JSON editor for this section:</p>
          <textarea
            className="field-input field-textarea"
            style={{ minHeight: '300px', fontFamily: 'monospace', fontSize: '0.78rem' }}
            value={JSON.stringify(data, null, 2)}
            onChange={e => {
              try {
                const parsed = JSON.parse(e.target.value);
                Object.keys(parsed).forEach(k => update(k, parsed[k]));
              } catch { /* ignore parse errors while typing */ }
            }}
          />
        </div>
      );
  }
}
