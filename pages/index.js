import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { THEME_LABELS, THEME_DESCRIPTIONS, THEMES } from '../lib/constants'

// ── Blinkit wordmark SVG ──────────────────────────────────────────────────────
function BlinkitWordmark({ height = 28 }) {
  return (
    <svg
      viewBox="0 0 228 60"
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <path fill="#F8CB45" d="M28.7,14.4c3.9,0,7.3,1,10.3,2.9c3.1,1.9,5.5,4.6,7.2,8.1c1.7,3.3,2.5,7.3,2.5,11.8c0,4.4-0.8,8.3-2.5,11.8c-1.7,3.5-4,6.2-7.1,8.1c-3.1,2-6.6,3-10.4,3c-2.8,0-5.5-0.6-7.9-1.7c-2.5-1.2-4.6-2.8-6.4-4.9V59H0V0h14.4v20.9c1.8-2.1,3.9-3.7,6.4-4.8C23.2,14.9,25.9,14.4,28.7,14.4z M24.4,48.1c2,0,3.9-0.5,5.5-1.4c1.6-0.9,2.9-2.2,3.8-3.9c0.9-1.6,1.4-3.5,1.4-5.6c0-2.1-0.5-3.9-1.4-5.6c-0.9-1.7-2.2-3-3.8-3.9c-1.6-0.9-3.4-1.4-5.5-1.4c-1.9,0-3.6,0.5-5.2,1.4c-1.5,0.9-2.7,2.2-3.6,3.8c-0.9,1.7-1.3,3.6-1.3,5.7c0,2.1,0.4,4,1.3,5.7c0.9,1.6,2,2.9,3.6,3.9C20.7,47.6,22.4,48.1,24.4,48.1z"/>
      <path fill="#F8CB45" d="M50.7,59V0H65v59H50.7z"/>
      <path fill="#F8CB45" d="M69.1,59V15.4h14.3V59H69.1z"/>
      <path fill="#F8CB45" d="M114.5,14.4c3.1,0,5.8,0.7,8.3,2.1c2.5,1.4,4.4,3.4,5.8,5.9c1.3,2.6,2,5.5,2,8.8V59h-13.7V34.4c0-1.6-0.3-3-1-4.2c-0.6-1.3-1.5-2.2-2.6-2.9c-1.1-0.7-2.4-1-3.9-1c-1.4,0-2.7,0.3-3.9,1c-1.2,0.7-2.1,1.6-2.8,2.7c-0.7,1.1-1,2.4-1,3.9L101.6,59H87.3V15.4h14.3v5c1.3-1.9,3.2-3.3,5.4-4.4C109.3,14.9,111.8,14.4,114.5,14.4z"/>
      <path fill="#F8CB45" d="M162.1,34.4L178.4,59h-16.2l-9.5-15.4l-4.4,5.1V59h-14.4V0h14.4v32.6L162,15.4h16.2L162.1,34.4z"/>
      <path fill="#F8CB45" d="M69.1,0h14.3v11.2H69.1V0z"/>
      <path fill="#54B226" d="M180.6,58.8V15.2h14.3v43.6H180.6z"/>
      <path fill="#54B226" d="M225.1,46.5l2.9,9.2c-1.3,1.2-2.9,2.2-4.9,3c-2,0.8-3.9,1.2-5.7,1.2c-2.7,0-5.1-0.6-7.2-1.8c-2.1-1.2-3.8-2.9-5-5c-1.2-2.1-1.8-4.5-1.8-7.2V26.6h-5.7V15.2h5.7V0h13.7v15.2h9v11.4h-9v16.6c0,1.4,0.4,2.5,1.1,3.4c0.7,0.9,1.7,1.3,2.8,1.3c0.8,0,1.6-0.1,2.3-0.4C224.1,47.4,224.7,47,225.1,46.5z"/>
      <path fill="#54B226" d="M180.5,0h14.3v11.2h-14.3V0z"/>
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
  const discPct = total > 0 ? ((disc / total) * 100).toFixed(1) + '%' : '0%'

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
              The silence is the signal not the volume.
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
const SAMPLE_REVIEWS = `Blinkit delivers everything I need. I reorder the same groceries every week without thinking.
Ordered pet food for the first time. Had no idea they even stocked this category.
Surge charges during rain are ridiculous. Amazon doesn't do this.
My order was missing two items and customer support did nothing.
I have never once looked at the banner ads. They blend into the background.
I only use the reorder button now. Never browse at all.
Tried a new brand of protein powder. No reviews on the page so I was nervous.
I didn't know Blinkit sold baby wipes until my friend told me.
I wanted to try a skincare product but there were no ratings. Went to Nykaa instead.
Bought coffee for the first time here. Only because it was out of stock on Amazon.
I never thought of buying cleaning products here. Seems expensive vs Jiomart.
I ordered the same thing 14 times this year. That says everything.
Product page had zero description. Just a photo and price. Had to Google the brand.
Why would I explore new things here? I am not here to shop, I am here to reorder.
Very fast delivery but the discovery experience is completely broken.`

function TabLive() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

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

  const handleCopySample = () => {
    navigator.clipboard.writeText(SAMPLE_REVIEWS).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleUseSample = () => {
    setText(SAMPLE_REVIEWS)
  }

  const discCount = results ? results.tags.filter(t => t.discovery_flag === 'yes').length : 0

  return (
    <div>
      <div className="section-heading">Classify reviews with Claude</div>

      <div className="live-layout">
        {/* Left: input + results */}
        <div className="live-main">
          <div className="info-box" style={{ marginBottom: 14 }}>
            <div className="info-box-body">
              Paste up to 30 Blinkit reviews one per line and run the same Claude
              classification pipeline that processed the full 1,718-item dataset. Each
              review gets a theme, a sentiment score, and a discovery flag.
            </div>
          </div>
          <textarea
            className="live-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste one review per line. Minimum 10 characters each."
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="run-btn" onClick={run} disabled={loading}>
              {loading ? 'Classifying…' : 'Run Classification'}
            </button>
            <button className="ghost-btn" onClick={handleUseSample}>
              Use sample reviews
            </button>
          </div>

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

        {/* Right: instructions panel */}
        <div className="live-sidebar">
          <div className="sidebar-block">
            <div className="sidebar-heading">How to use this</div>
            <ol className="sidebar-steps">
              <li>
                <span className="step-num">1</span>
                <span>Click <strong>Use sample reviews</strong> below to load 15 real-style Blinkit reviews into the textarea or paste your own.</span>
              </li>
              <li>
                <span className="step-num">2</span>
                <span>Each line is treated as one review. Keep them one per line, minimum 10 characters each. Up to 30 reviews per run.</span>
              </li>
              <li>
                <span className="step-num">3</span>
                <span>Click <strong>Run Classification</strong>. Claude processes every review against the same 10-theme taxonomy used on the full dataset.</span>
              </li>
              <li>
                <span className="step-num">4</span>
                <span>Results appear as a table: theme, sentiment (positive/neutral/negative), and a discovery flag for any review touching new-category behavior.</span>
              </li>
            </ol>
            <button className="sidebar-copy-btn" onClick={handleCopySample}>
              {copied ? 'Copied!' : 'Copy sample reviews'}
            </button>
          </div>

          <div className="sidebar-block" style={{ marginTop: 16 }}>
            <div className="sidebar-heading">What the pipeline does</div>
            <div className="sidebar-note">
              Your reviews go to a server-side API route that calls Claude with the fixed taxonomy prompt identical to how 1,718 items were classified. The API key never touches the browser. Results are returned as structured JSON and rendered here.
            </div>
          </div>

          <div className="sidebar-block" style={{ marginTop: 16 }}>
            <div className="sidebar-heading">10 themes Claude assigns</div>
            <div className="sidebar-tags">
              {Object.values(THEME_LABELS).map(l => (
                <span key={l} className="sidebar-tag">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tab: How it Works ─────────────────────────────────────────────────────────
function TabHow() {
  const steps = [
    {
      num: '01', title: 'Ingest',
      body: 'Play Store reviews via google-play-scraper, App Store reviews via the public iTunes RSS feed, and Reddit threads via public JSON endpoints deduplicated into one CSV.',
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
          A fixed taxonomy drafted after manually reading 200 reviews keeps tags
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
          Human-AI agreement on the 100-item blind sample came in at 81% above the
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
      <div className="section-heading">Classification Taxonomy 10 Themes</div>
      <div className="info-box" style={{ marginBottom: 20 }}>
        <div className="info-box-body">
          Each review is assigned exactly one theme. The taxonomy was built after manually
          reading 200 reviews to identify recurring patterns. Theme keys are fixed the
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
        <link rel="icon" href="data:image/png;base64,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" />
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

        {/* Try it Live CTA */}
        <div className="cta-band">
          <div className="cta-band-left">
            <div className="cta-band-label">
              <span className="cta-pulse" />
              Live Pipeline
            </div>
            <div className="cta-band-heading">Classify your own reviews with Claude</div>
            <div className="cta-band-body">
              Paste any Blinkit reviews one per line and run the same Claude classification
              pipeline that processed the full 1,718-item dataset. Every review gets a theme,
              a sentiment score, and a discovery flag in seconds.
            </div>
          </div>
          <button className="cta-band-btn" onClick={() => setTab(1)}>
            Try it Live
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, flexShrink: 0 }}>
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
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
