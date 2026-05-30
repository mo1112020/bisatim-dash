import { Sidebar } from '@/components/Sidebar';
import { PrefetchDashboard } from '@/components/PrefetchDashboard';

export const revalidate = 120;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <PrefetchDashboard />
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 220, padding: 36, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
