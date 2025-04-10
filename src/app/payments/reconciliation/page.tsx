import { PaymentReconciliation } from '@/components/payments/PaymentReconciliation';

export const metadata = {
  title: 'Payment Reconciliation | Texonica Dashboard',
  description: 'Match unmatched payments to clients',
};

export default function ReconciliationPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Payment Reconciliation</h1>
      <PaymentReconciliation />
    </div>
  );
} 