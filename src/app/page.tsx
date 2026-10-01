import { log } from '@/lib/logger';

export default function Home() {
  log('Home page rendered');
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Company Dashboard</h1>
        <p className="text-center mb-8">
          Please log in to access the dashboard.
        </p>
        <div className="flex justify-center">
          <a href="/login" className="btn">
            Login
          </a>
        </div>
      </div>
    </main>
  );
} 