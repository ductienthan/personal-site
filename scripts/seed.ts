/**
 * Seed the 3 existing blog posts into the database.
 * Run: npm run seed
 * (Requires DATABASE_URL in .env.local)
 */
import { config } from 'dotenv';
import path from 'path';

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : false,
});

const posts = [
  {
    slug: 'rag-that-doesnt-lie',
    title: "Building a RAG pipeline that doesn't lie",
    excerpt:
      "Hierarchical chunking, hybrid search, and grounding verification — how BookRAG got ~60% better answers than a naive baseline.",
    tags: ['RAG', 'pgvector', 'LLM'],
    published: true,
    created_at: '2026-04-18',
    content: `A naive RAG system is easy. A RAG system you'd trust to answer questions about a 400-page book — without hallucinating — is a different animal. Here's how BookRAG got there.

The first version of BookRAG did what every tutorial does: split the text into fixed chunks, embed them, stuff the top-k into a prompt, and hope. It worked for trivia and fell apart on anything that required context. The answers *sounded* right, which is the most dangerous failure mode there is.

The fix wasn't a bigger model. It was treating retrieval like the engineering problem it actually is.

## Chunking is a context problem, not a size problem

Fixed-size chunks force an impossible tradeoff: small chunks embed precisely but lose context; large chunks hold context but embed into mush. So I split the difference — literally — with **hierarchical chunking**:

- **Child chunks (80–120 tokens)** — small enough that the embedding actually means something. These are what vector search matches against.
- **Parent chunks (300–400 tokens)** — the surrounding context. When a child matches, the parent is what the LLM actually reads.

You search precise and read wide. Match quality goes up *and* the model gets enough context to answer.

## One retriever is never enough

Dense vector search is great at meaning and terrible at exact terms — names, codes, rare keywords. So BookRAG runs **BM25 keyword search alongside pgvector HNSW** and fuses the two ranked lists with **Reciprocal Rank Fusion**:

\`\`\`
score(d) = Σ  1 / (k + rank_i(d))
\`\`\`

RRF doesn't care about each retriever's score scale — it only cares about ranks, which makes it shockingly robust. That single change added **~15% keyword recall** with no downside.

## The 8 steps that actually matter

The retrieval pipeline grew to eight stages, each earning its place:

1. Fuzzy scope resolution (RapidFuzz ≥80%) so "the gatsby book" finds the right document.
2. LLM query rewriting with sub-query decomposition for multi-part questions.
3. pgvector HNSW cosine search, 768-dim, \`nomic-embed-text-v1.5\`.
4. BM25 hybrid search fused via RRF.
5. Cross-encoder reranking — a second model scores candidate pairs for relevance.
6. Parent-chunk promotion — swap child matches for their parent context.
7. Grounding verification — the LLM tags its answer with the source passages it actually used.
8. TTL cache — cache the full retrieval + generation result for repeated queries.

Steps 5 and 6 together account for the bulk of the **~60% answer quality improvement** over the naive baseline. The cache cuts repeat-query latency by **95%+**.

## What I'd do differently

The biggest headache was resumable embedding. If a worker dies mid-ingestion, you don't want to re-embed 200 pages. I built a checkpoint table tracking ingestion progress per document — ugly, but it made the system genuinely fault-tolerant.

The lesson: production RAG is mostly plumbing. The model is the easy part.`,
  },
  {
    slug: 'hunting-p99',
    title: 'Hunting the p99: keeping auth under 100ms',
    excerpt:
      "How a clustered session-extension queue and some unglamorous SQL tuning killed CPU saturation at peak traffic for a service taking 120K+ requests a day.",
    tags: ['Latency', 'Queues', 'SQL'],
    published: true,
    created_at: '2026-03-02',
    content: `Averages lie. A service can look perfectly healthy on the mean and still be setting fire to one user in a hundred. This is how we chased the tail latency out of a core auth service taking 120K+ requests a day.

The dashboard said everything was fine. Average response time hovered around 40ms. But support tickets kept trickling in: intermittent timeouts, sign-ins that hung for seconds. The average was hiding the crime scene.

The p99 told the truth. Once a day, at peak traffic, the tail blew out — and CPU on the session nodes saturated right alongside it.

## Why averages are a trap

If 99 requests take 40ms and one takes 4 seconds, your average is still a comfortable ~80ms. But that hundredth user is having a terrible time, and at 120K requests a day, "one in a hundred" is over a thousand bad experiences daily. **You optimize the tail, not the mean.**

## The culprit: session extension under load

Every active SSO session needed periodic extension. Under normal load, fine. At peak, thousands of extensions hit the same path at once — each doing a synchronous write — and the database turned into a single-lane bridge. CPU pinned, latency spiked, the tail exploded.

## The fix: cluster, balance, tune

- **Decouple the work.** Session extensions moved into a clustered queue instead of executing inline on the request path. The user's request returns immediately; the extension happens just behind it.
- **Load-balance the consumers.** Spreading queue consumers across nodes meant no single node ate the whole peak.
- **Tune the SQL.** The unglamorous part — the right indexes and a tighter query plan turned the hot write from a table-scan-adjacent mess into a point operation.

> The CPU saturation didn't get optimized away. It got designed away. Those are different things.

The result: CPU saturation gone, and a **consistent sub-100ms p99** held globally — even through the peak window that used to break it.

## The takeaway

Watch percentiles, not averages. And when a hot path is synchronous and contended, the answer is usually to get the slow work *off* the request path entirely. A queue isn't just throughput — it's a pressure-release valve for your tail latency.`,
  },
  {
    slug: 'transactional-outbox',
    title: 'The Transactional Outbox, and why I trust it',
    excerpt:
      "Guaranteeing no record is lost between ingestion and vector storage when a Celery worker dies mid-flight.",
    tags: ['Patterns', 'Reliability', 'Celery'],
    published: true,
    created_at: '2026-01-20',
    content: `Building the movie recommender, I hit the oldest distributed-systems problem there is: I needed to do two things atomically that live in two different places. Here's the pattern that saved me.

The pipeline was simple on paper. Ingest a movie into Postgres, then push a job to generate its embedding and store it in the vector index. Two steps. What could go wrong?

Everything, if the worker dies between step one and step two. The movie exists; its embedding never does. It's silently unsearchable, and nobody notices until a user wonders why a film they know is in the catalog never shows up.

## The dual-write trap

The instinct is to write to the database and publish to the queue back to back:

\`\`\`python
db.insert(movie)        # committed
queue.publish(job)      # ...what if this fails?
\`\`\`

There's no transaction spanning both. The DB commit can succeed and the publish can fail — or vice versa. You cannot make a database and a message broker agree atomically without a distributed transaction, and you do not want a distributed transaction.

## Enter the outbox

The Transactional Outbox pattern makes the problem disappear by refusing to do a dual write at all. You write the job **into the same database, in the same transaction** as the data:

\`\`\`sql
BEGIN;
  INSERT INTO movies (...);
  INSERT INTO outbox  (event='embed', payload=...);
COMMIT;
\`\`\`

Now it's one atomic commit. Either both rows land or neither does. A separate relay process polls the outbox table and publishes those events to the queue, marking each as sent once the broker acknowledges.

> The magic is that the queue is no longer part of your consistency boundary. The database is the single source of truth, and the queue becomes an eventually-consistent projection of it.

## What it buys you

- **No lost records.** If the relay crashes, the events are still sitting in the outbox waiting. It picks up where it left off.
- **At-least-once delivery** for free — so downstream consumers just need to be idempotent.
- **Auditability.** The outbox is a literal log of everything that should have happened.

Paired with structured logs and per-stage timing metrics, the result is a pipeline where I can say — and prove — that no record is lost between ingestion and vector storage, even under worker failure. That confidence is worth the extra table.`,
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    for (const post of posts) {
      await client.query(
        `INSERT INTO posts (slug, title, excerpt, content, tags, published, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           excerpt = EXCLUDED.excerpt,
           content = EXCLUDED.content,
           tags = EXCLUDED.tags,
           published = EXCLUDED.published`,
        [post.slug, post.title, post.excerpt, post.content, post.tags, post.published, post.created_at]
      );
      console.log(`✓ Seeded: ${post.slug}`);
    }
    console.log('\nSeed complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
