import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Duc Than — Software Engineer',
  description: 'Backend systems, distributed architecture, and AI/RAG pipelines.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="bg-layer bg-grid" />
          <div className="bg-layer bg-glow" />
          <div className="bg-layer bg-scan" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
