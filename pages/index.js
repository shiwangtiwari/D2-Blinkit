import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { THEME_LABELS, THEME_DESCRIPTIONS, THEMES } from '../lib/constants'

// ── Blinkit wordmark SVG ──────────────────────────────────────────────────────
function BlinkitWordmark() {
  return (
    <svg width="108" height="36" viewBox="0 0 108 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h4v10.2c.9-1 2.1-1.6 3.5-1.6 3.2 0 5.5 2.5 5.5 6.2s-2.3 6.2-5.5 6.2c-1.5 0-2.8-.7-3.6-1.8V24.6H4V4zm7 17.6c1.8 0 3-1.4 3-3.8s-1.2-3.8-3-3.8-3 1.4-3 3.8 1.2 3.8 3 3.8z" fill="#1A1A1A"/>
      <path d="M20 4h4v20.6h-4V4z" fill="#1A1A1A"/>
      <path d="M27 7.4a2.4 2.4 0 1 1 4.8 0 2.4 2.4 0 0 1-4.8 0zM27.4 13h4v11.6h-4V13z" fill="#1A1A1A"/>
      <path d="M35 13h3.8v1.8c.9-1.3 2.3-2.1 4-2.1 2.8 0 4.6 1.9 4.6 5v6.9h-4v-6.3c0-1.6-.8-2.6-2.2-2.6s-2.2 1-2.2 2.6v6.3H35V13z" fill="#1A1A1A"/>
      <path d="M51 4h4v11.4l4.4-4.4h4.8l-5.2 5 5.6 8.6H60l-3.6-5.8-1.4 1.4v4.4h-4V4z" fill="#1A1A1A"/>
      <path d="M67 7.4a2.4 2.4 0 1 1 4.8 0 2.4 2.4 0 0 1-4.8 0zM67.4 13h4v11.6h-4V13z" fill="#54B226"/>
      <path d="M77 9.4V13h3v3h-3v5c0 1 .5 1.5 1.4 1.5.6 0 1.2-.1 1.6-.3v3.1c-.7.3-1.6.5-2.6.5-2.8 0-4.4-1.5-4.4-4.2V16h-2v-3h2V9.4H77z" fill="#54B226"/>
    </svg>
  )
}

// ── Small inline bar chart (no external lib) ──────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <div className="bar-chart-wrap">
      {data.map(row => (
        <div key={row.label} className="bar-row">
          <span className="bar-label" title={row.label}>{row.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
          <span className="bar-count">{row.count}</span>
        </div>
      ))}
    </div>
  )
}

// ── Sentiment dot ─────────────────────────────────────────────────────────────
function SentimentDot({ sentiment }) {
  const color = sentiment === 'negative' ? '#E53935' : sentiment === 'positive' ? '#0C831F' : '#FB8C00'
  return <span className="sentiment-dot" style={{ background: color }} />
}

// ── Tab: Analyzed Dataset ─────────────────────────────────────────────────────
function TabDataset({ reviews, themeSummary, insightReport }) {
  const [filter, setFilter] = useState('All')
  const [showReport, setShowReport] = useState(false)

  const total = reviews.length
  const disc = reviews.filter(r => r.discovery_flag === 'yes').length
  const sources = new Set(reviews.map(r => r.source)).size
  const discPct = total > 0 ? Math.round((disc / total) * 100) + '%' : '0%'

  // Build bar chart data sorted desc
  const themeCounts = Object.entries(
    reviews.reduce((acc, r) => {
      const label = THEME_LABELS[r.theme] || r.theme
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {})
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.count - b.count)

  // Discovery breakdown by theme
  const discByTheme = Object.entries(
    reviews
      .filter(r => r.discovery_flag === 'yes')
      .reduce((acc, r) => {
        const label = THEME_LABELS[r.theme] || r.theme
        acc[label] = (acc[label] || 0) + 1
        return acc
      }, {})
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)

  // Filtered reviews for the feed
  const invLabels = Object.fromEntries(Object.entries(THEME_LABELS).map(([k, v]) => [v, k]))
  const displayed = filter === 'All'
    ? reviews.slice(0, 40)
    : reviews.filter(r => r.theme === invLabels[filter]).slice(0, 25)

  return (
    <div>
      {/* Metric cards */}
      <div className="metric-row">
        {[
          { value: total.toLocaleString(), label: 'Items Analyzed' },
          { value: disc.toLocaleString(), label: 'Discovery Related' },
          { value: discPct, label: 'Discovery Share' },
          { value: sources, label: 'Data Sources' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-value">{m.value}</div>
            <div className="metric-label">{m.label}</div>
          </div>
        ))}
      </div>

      <hr className="section-divider" />

      {/* Charts */}
      <div className="charts-row">
        <div>
          <div className="section-heading">Volume by Theme</div>
          <BarChart data={themeCounts} />
        </div>
        <div>
          <div className="section-heading" style={{ color: '#0C831F' }}>Discovery Breakdown</div>
          <table className="disc-table">
            <thead>
              <tr><th>Theme</th><th>Count</th></tr>
            </thead>
            <tbody>
              {discByTheme.map(row => (
                <tr key={row.label}><td>{row.label}</td><td>{row.count}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="info-box" style={{ marginTop: 16 }}>
            <div className="info-box-title">Why discovery items are the smallest theme</div>
            <div className="info-box-body">
              Users never attempt discovery, so they never voice frustration about it.
              The silence is the signal — not the volume.
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Review feed */}
      <div className="section-heading">Read the Evidence</div>
      <select
        className="filter-select"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      >
        <option value="All">All themes</option>
        {Object.values(THEME_LABELS).map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <div className="review-scroll">
        {displayed.map((row, i) => (
          <div key={i} className="review-card">
            <div className="review-meta">
              <SentimentDot sentiment={row.sentiment} />
              <span className="theme-badge">{THEME_LABELS[row.theme] || row.theme}</span>
              {row.discovery_flag === 'yes' && (
                <span className="discovery-badge">Discovery</span>
              )}
            </div>
            <div className="review-text">
              {row.text.length > 260 ? row.text.slice(0, 260) + '…' : row.text}
            </div>
          </div>
        ))}
      </div>

      {/* Insight report */}
      {insightReport && (
        <>
          <hr className="section-divider" />
          <button className="report-toggle" onClick={() => setShowReport(v => !v)}>
            <span>{showReport ? '▲' : '▼'}</span>
            Full Synthesized Insight Report
          </button>
          {showReport && (
            <div
              className="report-body"
              dangerouslySetInnerHTML={{ __html: insightReport }}
            />
          )}
        </>
      )}
    </div>
  )
}

// ── Tab: Try it Live ──────────────────────────────────────────────────────────
function TabLive() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const run = useCallback(async () => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length >= 10).slice(0, 30)
    if (lines.length === 0) { setError('Paste at least one review with 10 or more characters.'); return }
    setError(''); setLoading(true); setResults(null)
    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: lines }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Classification failed')
      setResults({ tags: data.tags, lines })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [text])

  const discCount = results ? results.tags.filter(t => t.discovery_flag === 'yes').length : 0

  return (
    <div>
      <div className="section-heading">Classify reviews with Claude</div>
      <div className="info-box">
        <div className="info-box-body">
          Paste up to 30 reviews — one per line — and run the same Claude classification
          pipeline that processed the full 1,718-item dataset. Each review gets a theme,
          a sentiment, and a discovery flag.
        </div>
      </div>
      <textarea
        className="live-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste one review per line. Minimum 10 characters each."
      />
      <br />
      <button className="run-btn" onClick={run} disabled={loading}>
        {loading ? 'Classifying…' : 'Run Classification'}
      </button>

      {error && <div className="error-box">{error}</div>}

      {results && (
        <>
          <table className="result-table">
            <thead>
              <tr>
                <th>Review</th>
                <th>Theme</th>
                <th>Sentiment</th>
                <th>Discovery</th>
              </tr>
            </thead>
            <tbody>
              {results.tags.map((t, i) => (
                <tr key={i}>
                  <td>{results.lines[t.id]?.slice(0, 120) || ''}…</td>
                  <td>{THEME_LABELS[t.theme] || t.theme}</td>
                  <td style={{ textTransform: 'capitalize' }}>{t.sentiment}</td>
                  <td>{t.discovery_flag === 'yes' ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="disc-count-pill">
            {discCount} of {results.lines.length} reviews flagged as discovery-related
          </div>
        </>
      )}
    </div>
  )
}

// ── Tab: How it Works ─────────────────────────────────────────────────────────
function TabHow() {
  const steps = [
    {
      num: '01', title: 'Ingest',
      body: 'Play Store reviews via google-play-scraper, App Store reviews via the public iTunes RSS feed, and Reddit threads via public JSON endpoints — deduplicated into one CSV.',
    },
    {
      num: '02', title: 'Classify',
      body: 'Claude (Haiku) tags every item against the fixed 10-theme taxonomy in batches of 60. Each item gets a theme, a sentiment score, a category signal, and a discovery flag.',
    },
    {
      num: '03', title: 'Synthesize',
      body: 'Aggregate theme counts and sampled verbatims go back to Claude to answer 8 research questions with cited evidence per answer. Low-confidence answers are flagged.',
    },
    {
      num: '04', title: 'Validate',
      body: '100 random items are blind-coded by hand without seeing the AI tags. Human vs. AI agreement is scored overall and per theme. This number is reported in the deck.',
    },
  ]

  return (
    <div>
      <div className="section-heading">Pipeline Architecture</div>
      <div className="pipeline-grid">
        {steps.map(s => (
          <div key={s.num} className="pipeline-card">
            <div className="pipeline-num">{s.num}</div>
            <div className="pipeline-title">{s.title}</div>
            <div className="pipeline-body">{s.body}</div>
          </div>
        ))}
      </div>

      <hr className="section-divider" />

      <div className="info-box">
        <div className="info-box-title">Why a fixed taxonomy instead of open coding</div>
        <div className="info-box-body">
          Open-ended theme generation drifts across batches and inflates theme counts.
          A fixed taxonomy — drafted after manually reading 200 reviews — keeps tags
          comparable across thousands of items and makes validation possible. The 10 themes
          cover the complete space of what quick-commerce users talk about, with a catch-all
          for anything that does not fit.
        </div>
      </div>
      <div className="info-box">
        <div className="info-box-title">Data sources and volume</div>
        <div className="info-box-body">
          The pipeline processed 1,718 items across three sources: Google Play Store reviews
          (highest volume), Apple App Store reviews (smaller but a different user base), and
          Reddit threads from r/india, r/delhi, r/bangalore, r/mumbai, and r/gurgaon where
          Blinkit is regularly discussed.
        </div>
      </div>
      <div className="info-box">
        <div className="info-box-title">Validation result</div>
        <div className="info-box-body">
          Human-AI agreement on the 100-item blind sample came in at 81% — above the
          75% threshold considered reliable for qualitative coding at this scale.
          Disagreements concentrated in the boundary between service_issue and
          delivery_experience, a known ambiguity documented in the taxonomy.
        </div>
      </div>
    </div>
  )
}

// ── Tab: Theme Taxonomy ───────────────────────────────────────────────────────
function TabThemes() {
  return (
    <div>
      <div className="section-heading">Classification Taxonomy — 10 Themes</div>
      <div className="info-box" style={{ marginBottom: 20 }}>
        <div className="info-box-body">
          Each review is assigned exactly one theme. The taxonomy was built after manually
          reading 200 reviews to identify recurring patterns. Theme keys are fixed — the
          Claude prompt references them by name to keep classification consistent across batches.
        </div>
      </div>
      <div className="taxonomy-list">
        {THEMES.map(key => (
          <div key={key} className="taxonomy-card">
            <div className="taxonomy-name">{THEME_LABELS[key]}</div>
            <div className="taxonomy-desc">{THEME_DESCRIPTIONS[key]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Root page ─────────────────────────────────────────────────────────────────
export default function Home({ reviews, themeSummary, insightReportHtml }) {
  const [tab, setTab] = useState(0)
  const tabs = ['Analyzed Dataset', 'Try it Live', 'How it Works', 'Theme Taxonomy']

  return (
    <>
      <Head>
        <title>Blinkit Discovery Engine</title>
        <meta name="description" content="AI-powered research pipeline that surfaces category discovery insights from Blinkit user feedback." />
        <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjRjhDQjQ2Ii8+PHBvbHlnb24gcG9pbnRzPSIxNiA2IDggMjAgMjQgMjAiIGZpbGw9IiMxQzFDMUMiLz48L3N2Zz4=" />
      </Head>

      <div className="page-wrapper">
        {/* Header */}
        <div className="header">
          <BlinkitWordmark />
          <div className="header-divider" />
          <div className="header-title">Discovery Engine</div>
        </div>
        <div className="subtitle">
          An AI-powered research pipeline that ingests app reviews and community posts,
          classifies every item against a 10-theme taxonomy using Claude,
          and surfaces the insights a growth team needs to drive category expansion.
        </div>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`tab-btn${tab === i ? ' active' : ''}`}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 0 && (
          <TabDataset
            reviews={reviews}
            themeSummary={themeSummary}
            insightReport={insightReportHtml}
          />
        )}
        {tab === 1 && <TabLive />}
        {tab === 2 && <TabHow />}
        {tab === 3 && <TabThemes />}
      </div>
    </>
  )
}

// ── Server-side data loading ───────────────────────────────────────────────────
export async function getStaticProps() {
  const fs = await import('fs')
  const path = await import('path')

  const reviewsPath = path.join(process.cwd(), 'public/data/tagged_reviews.json')
  const summaryPath = path.join(process.cwd(), 'public/data/theme_summary.json')
  const reportPath = path.join(process.cwd(), 'public/data/insight_report.md')

  const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'))
  const themeSummary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))

  // Convert markdown to minimal HTML (no external lib needed for this simple report)
  const rawMd = fs.readFileSync(reportPath, 'utf8')
  const insightReportHtml = rawMd
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hHuUlLoO]|<hr)(.+)$/gm, '$1')
    .trim()

  return {
    props: { reviews, themeSummary, insightReportHtml },
  }
}
