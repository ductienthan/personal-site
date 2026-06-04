import Nav from '@/components/Nav';
import HomeClient from '@/components/HomeClient';
import { query } from '@/lib/db';
import type { Post } from './api/posts/route';
import Link from 'next/link';

async function getLatestPosts(): Promise<Post[]> {
  try {
    const posts = await query<Post>(
      'SELECT id, slug, title, excerpt, tags, created_at FROM posts WHERE published = true ORDER BY created_at DESC LIMIT 3'
    );
    return posts;
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, '.');
}

export default async function HomePage() {
  const posts = await getLatestPosts();

  return (
    <>
      <Nav activePage="home" />
      <HomeClient />

      {/* ── Hero ── */}
      <section className="hero" id="top">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="hero-status reveal">
                <span className="live"><i />&nbsp;SYSTEM ONLINE</span>
                <span>LOC: <b>FRESNO, CA</b></span>
                <span>ROLE: <b>SWE II</b></span>
              </div>
              <h1 className="reveal d1">DUC<br /><span className="accent">THAN</span></h1>
              <div
                className="hero-role reveal d2"
                data-typewriter='["Software Engineer II @ Samsung","Backend & Distributed Systems","AI / RAG Pipeline Architect","Low-latency Infrastructure"]'
              >
                <span className="tw-text" />
                <span className="tw-cursor">▋</span>
              </div>
              <p className="hero-desc reveal d3">
                I build high-throughput backend systems and AI retrieval pipelines —
                architecting services that stay fast and reliable at 10M+ requests a day.
              </p>
              <div className="hero-cta reveal d4">
                <a href="#projects" className="btn primary">View Work →</a>
                <a href="#contact" className="btn">Get in Touch</a>
              </div>
            </div>
            <div className="panel hud-card reveal d3">
              <div className="hud-head"><span>SYS_PROFILE.LOG</span><span>v2.6</span></div>
              <div className="hud-row"><span>handle</span><b>@ductienthan</b></div>
              <div className="hud-row"><span>focus</span><b className="glow">backend · ai · infra</b></div>
              <div className="hud-row"><span>stack</span><b>node · python · ts</b></div>
              <div className="hud-row"><span>uptime</span><b>4+ yrs</b></div>
              <div className="hud-row"><span>p99</span><b className="glow">&lt; 100 ms</b></div>
              <div className="hud-row"><span>status</span><b className="glow">open to talk</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="wrap">
        <div className="stats">
          <div className="stat reveal">
            <div className="num"><span data-count="10">0</span><span className="suf">M+</span></div>
            <div className="lbl">Daily requests served</div>
          </div>
          <div className="stat reveal d1">
            <div className="num"><span className="suf">&lt;</span><span data-count="100">0</span><span className="suf">ms</span></div>
            <div className="lbl">p99 response latency</div>
          </div>
          <div className="stat reveal d2">
            <div className="num"><span data-count="95">0</span><span className="suf">%</span></div>
            <div className="lbl">Repeat-query latency cut</div>
          </div>
          <div className="stat reveal d3">
            <div className="num"><span data-count="3.88" data-dec="2">0</span></div>
            <div className="lbl">GPA · CS, UT Arlington</div>
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <section id="about">
        <div className="wrap">
          <span className="kicker reveal">01 / About</span>
          <h2 className="section-title reveal d1">Engineer for systems under load.</h2>
          <div className="about-grid" style={{ marginTop: 50 }}>
            <div className="about-body reveal d2">
              <p>I&apos;m a software engineer who lives in the <b>backend</b> — the queues, caches, and data pipelines that have to stay fast when traffic spikes and stay correct when things fail.</p>
              <p>At <b>Samsung Electronics America</b>, I lead a core authentication service handling 120K+ requests a day and a pricing engine serving 10M+. Lately I&apos;ve gone deep on <b>AI infrastructure</b>: RAG pipelines, vector search, LLM tooling, and MCP agents that do real work in production.</p>
              <p>I care about the unglamorous parts — sub-100ms p99s, fault-tolerant ingestion, observability you can actually debug with. The kind of engineering you only notice when it&apos;s missing.</p>
            </div>
            <div className="about-meta panel reveal d3">
              <div className="row"><span className="k">Name</span><span className="v">Duc Than</span></div>
              <div className="row"><span className="k">Role</span><span className="v">Software Engineer II</span></div>
              <div className="row"><span className="k">Company</span><span className="v">Samsung Electronics America</span></div>
              <div className="row"><span className="k">Based</span><span className="v">Sunnyvale, California</span></div>
              <div className="row"><span className="k">Degree</span><span className="v">B.S. Computer Science · 3.88 GPA</span></div>
              <div className="row"><span className="k">Email</span><span className="v"><a href="mailto:thantienduc@gmail.com">thantienduc@gmail.com</a></span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills">
        <div className="wrap">
          <span className="kicker reveal">02 / Capabilities</span>
          <h2 className="section-title reveal d1">Stack &amp; systems.</h2>
          <div className="skills-grid">
            <div className="skill-cat panel reveal d2">
              <div className="skill-head"><span className="idx">[01]</span><h3>Languages</h3><span className="line" /></div>
              <div className="chips">
                {['JavaScript / Node.js','TypeScript','Python','SQL','Next.js'].map(s => <span className="chip" key={s}>{s}</span>)}
              </div>
            </div>
            <div className="skill-cat panel reveal d2">
              <div className="skill-head"><span className="idx">[02]</span><h3>Backend &amp; Data</h3><span className="line" /></div>
              <div className="chips">
                {['FastAPI','Hapi','RabbitMQ','Celery','Redis','PostgreSQL','pgvector','Elasticsearch','OpenSearch','Pusher','NeonDB','Pydantic','AWS'].map(s => <span className="chip" key={s}>{s}</span>)}
              </div>
            </div>
            <div className="skill-cat panel reveal d3">
              <div className="skill-head"><span className="idx">[03]</span><h3>AI / ML</h3><span className="line" /></div>
              <div className="chips">
                {['RAG Pipelines','LLM Integration','MCP Agents','Vector Search','Embeddings','sentence-transformers','BM25 Hybrid Search','Cross-encoder Rerank','HNSW','tiktoken','EasyOCR','Isolation Forest'].map(s => <span className="chip" key={s}>{s}</span>)}
              </div>
            </div>
            <div className="skill-cat panel reveal d3">
              <div className="skill-head"><span className="idx">[04]</span><h3>Systems &amp; Tooling</h3><span className="line" /></div>
              <div className="chips">
                {['Queue Clustering','Load Balancing','SQL Tuning','Async / Concurrency','CDN / Edge Caching','Transactional Outbox','RRF','Jenkins','Docker','Git','Kibana','Alembic','pytest'].map(s => <span className="chip" key={s}>{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience">
        <div className="wrap">
          <span className="kicker reveal">03 / Experience</span>
          <h2 className="section-title reveal d1">Where I&apos;ve shipped.</h2>
          <div style={{ marginTop: 54 }} className="reveal d2">
            <div className="xp-item">
              <div className="xp-when">JUL 2022 — PRESENT</div>
              <div className="xp-role">Software Engineer II</div>
              <div className="xp-co">Samsung Electronics America <span className="at">— Mountain View, CA</span></div>
              <ul className="xp-list">
                <li><b>Lead engineer</b> for a core authentication service processing <b>120K+ requests/day</b> — owned architecture, reliability, and incident response.</li>
                <li>Architected a clustered <b>SSO session-extension queue</b> with load balancing and SQL tuning — eliminated CPU saturation at peak and held <b>sub-100ms p99</b> latency globally.</li>
                <li>Replaced legacy Java middleware with a <b>Node.js + Hapi</b> layer, cutting inter-service latency <b>~300ms</b> across all daily traffic.</li>
                <li>Built <b>Isolation Forest</b> anomaly detection on latency/throughput signals (MTTD ↓ 5–10%); shipped an LLM tool for automated Git-diff root-cause analysis.</li>
                <li>Engineered a high-throughput shopping cart with <b>Akamai CDN + multi-layer Redis</b> caching to offload origin traffic under sustained peaks.</li>
                <li>Designed a combinatorial <b>pricing engine serving 10M+ daily requests</b> with sub-millisecond lookups; built OpenSearch observability dashboards.</li>
              </ul>
              <div className="xp-sub">
                <span className="tag">Internal Platform</span>
                <h4>AI-Powered PTO Request Tool</h4>
                <ul className="xp-list">
                  <li>Designed a <b>FastAPI + MCP-agent</b> system letting thousands of employees submit PTO via template-driven Adaptive Cards; decoupled the agent from the HR backend via async queue for resilience against UKG API timeouts.</li>
                  <li>Built a cron worker mapping employees to managers; used AI coding agents to cut delivery time <b>~40%</b>.</li>
                </ul>
              </div>
            </div>
            <div className="xp-item">
              <div className="xp-when">2021</div>
              <div className="xp-role">B.S. Computer Science</div>
              <div className="xp-co">University of Texas at Arlington <span className="at">— GPA 3.88</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects">
        <div className="wrap">
          <span className="kicker reveal">04 / Selected Work</span>
          <h2 className="section-title reveal d1">Things I&apos;ve built.</h2>
          <div className="proj-grid">
            <div className="proj panel reveal d2">
              <div className="proj-top"><span className="proj-no">PRJ_01</span></div>
              <h3>BookRAG</h3>
              <div className="proj-tag">AI-Powered Book Q&amp;A System</div>
              <p>A production-grade <b>5-layer RAG system</b> with async ingestion, OCR fallback, and hierarchical chunking. Resumable embedding guarantees zero data loss on worker failure. An 8-step retrieval pipeline + cross-encoder reranking lifted answer quality <b>~60%</b>; TTL caching cut repeat latency <b>95%+</b>.</p>
              <div className="proj-stack">
                {['Python','pgvector','HNSW','BM25 (RRF)','Ollama','Docker'].map(s => <span key={s}>{s}</span>)}
              </div>
            </div>
            <div className="proj panel reveal d2">
              <div className="proj-top"><span className="proj-no">PRJ_02</span></div>
              <h3>Movie Recommender</h3>
              <div className="proj-tag">Async Embedding + LLM Re-rank</div>
              <p>Celery workers ingest movies, generate embeddings, and persist to pgvector; an <b>LLM agent re-ranks</b> cosine-similarity candidates for natural-language quality. A <b>Transactional Outbox</b> guarantees no record loss between ingestion and vector storage under worker failure.</p>
              <div className="proj-stack">
                {['FastAPI','Celery','pgvector','Redis','LLM Rerank'].map(s => <span key={s}>{s}</span>)}
              </div>
            </div>
            <div className="proj panel reveal d3">
              <div className="proj-top"><span className="proj-no">PRJ_03</span></div>
              <h3>Automated Trading CLI</h3>
              <div className="proj-tag">Concurrent Real-Time Engine</div>
              <p>A <b>hybrid threading + asyncio</b> model parallelizes real-time price streams across instruments. Event-driven per-instrument task queues enable low-latency RSI signal processing and automated order execution — without shared-state contention.</p>
              <div className="proj-stack">
                {['Python','AsyncIO','Threading','IG Markets API'].map(s => <span key={s}>{s}</span>)}
              </div>
            </div>
            <div className="proj panel reveal d3">
              <div className="proj-top">
                <span className="proj-no">PRJ_04</span>
                <a href="https://zuika-quan.com" target="_blank" rel="noopener noreferrer" className="proj-link">LIVE ↗</a>
              </div>
              <h3>Zuika</h3>
              <div className="proj-tag">Real-Time Web Application</div>
              <p>Built with <b>Next.js</b> (SSR + App Router) and <b>Pusher</b> pub-sub for real-time bidirectional events — no polling overhead. Hybrid persistence via NeonDB + local storage, with CDN edge caching for sub-50ms global asset delivery.</p>
              <div className="proj-stack">
                {['Next.js','Pusher','NeonDB','CDN'].map(s => <span key={s}>{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog teaser ── */}
      <section id="blog">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span className="kicker reveal">05 / Journal</span>
              <h2 className="section-title reveal d1">Notes &amp; write-ups.</h2>
              <p className="section-sub reveal d2">Things I&apos;ve learned building systems under load — RAG internals, latency hunting, and architecture decisions.</p>
            </div>
            <Link href="/blog" className="btn reveal d2">All Posts →</Link>
          </div>

          <div className="blog-list reveal d3">
            {posts.length > 0 ? posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="post-row">
                <div className="post-date">{formatDate(post.created_at)}</div>
                <div className="post-main">
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  {post.tags?.length > 0 && (
                    <div className="post-tags">{post.tags.map(t => <span key={t}>{t}</span>)}</div>
                  )}
                </div>
                <div className="post-arrow">→</div>
              </Link>
            )) : (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)', padding: '30px 8px' }}>
                // Posts coming soon — check back shortly.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="contact">
        <div className="wrap">
          <span className="kicker center reveal">06 / Contact</span>
          <div className="big reveal d1">Let&apos;s build<br />something <a href="mailto:thantienduc@gmail.com">fast.</a></div>
          <div className="contact-links reveal d2">
            <a href="mailto:thantienduc@gmail.com" className="btn primary">thantienduc@gmail.com</a>
            <a href="https://linkedin.com/in/duc-than-60566015b" target="_blank" rel="noopener noreferrer" className="btn">LinkedIn ↗</a>
            <a href="https://github.com/ductienthan" target="_blank" rel="noopener noreferrer" className="btn">GitHub ↗</a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="wrap">
          <span>© 2026 DUC THAN — SUNNYVALE, CA</span>
          <span>BUILT WITH NODE, PYTHON &amp; TOO MUCH COFFEE</span>
        </div>
      </footer>
    </>
  );
}
