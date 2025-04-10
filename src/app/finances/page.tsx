import CSVImporter from '@/components/CSVImporter';
import ChargebeeSyncButton from '@/components/ChargebeeSyncButton';
import PaymentReconciliation from '@/components/PaymentReconciliation';

export default function FinancesPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold">Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CSVImporter />
        <div className="flex items-center justify-center">
          <ChargebeeSyncButton />
        </div>
      </div>
      
      <PaymentReconciliation />
    </div>
  );
} 