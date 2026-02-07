import { Spinner } from '@/components/ui/spinner';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner label="Loading dashboard..." />
    </div>
  );
}
