import { CSVImportForm } from '@/components/payments/CSVImportForm';

export const metadata = {
  title: 'Import Payments | Texonica Dashboard',
  description: 'Import payments from CSV file',
};

export default function ImportPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Import Payments</h1>
      <CSVImportForm />
    </div>
  );
} 