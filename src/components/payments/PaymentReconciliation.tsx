'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentSource } from '@/lib/types/payments';
import { Badge } from '@/components/ui/badge';

interface Client {
  id: string;
  name: string;
}

interface Payment {
  id: string;
  name: string;
  date: string;
  amount: number;
  currency: string;
  sender: string;
  rawSender: string;
  paymentSource: PaymentSource;
  description: string;
}

export function PaymentReconciliation() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<PaymentSource | 'all'>('all');
  
  // Fetch unmatched payments
  useEffect(() => {
    const fetchUnmatchedPayments = async () => {
      try {
        const response = await fetch('/api/payments?unmatched=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch unmatched payments');
        }
        
        const data = await response.json();
        
        setPayments(data.payments.map((payment: any) => ({
          id: payment.id,
          name: payment.name,
          date: payment.fields.Date,
          amount: payment.fields.Amount,
          currency: payment.fields.Currency,
          sender: payment.fields.Sender,
          rawSender: payment.fields.RawSender || payment.fields.Sender,
          paymentSource: payment.fields.PaymentSource || PaymentSource.UNKNOWN,
          description: payment.fields.Description
        })));
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching payments');
      }
    };
    
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        
        const data = await response.json();
        
        setClients(data.clients.map((client: any) => ({
          id: client.id,
          name: client.fields.Name
        })));
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching clients');
      }
    };
    
    Promise.all([fetchUnmatchedPayments(), fetchClients()])
      .finally(() => setLoading(false));
  }, []);
  
  // Handle client selection for a payment
  const handleClientSelect = (paymentId: string, clientId: string) => {
    setSelectedPayments(prev => ({ 
      ...prev, 
      [paymentId]: clientId 
    }));
  };
  
  // Save the client mapping
  const handleSaveMapping = async (paymentId: string) => {
    const clientId = selectedPayments[paymentId];
    if (!clientId) return;
    
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;
    
    try {
      const response = await fetch('/api/payments/map-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senderId: payment.rawSender,
          clientId,
          paymentSource: payment.paymentSource
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to map client');
      }
      
      // Also update the payment record with the client
      const updateResponse = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Client: clientId
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update payment record');
      }
      
      // Remove the mapped payment from the list
      setPayments(payments.filter(p => p.id !== paymentId));
      
      // Clear the selection
      const { [paymentId]: removed, ...rest } = selectedPayments;
      setSelectedPayments(rest);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the mapping');
    }
  };
  
  // Get payment source badge color
  const getSourceBadgeColor = (source: PaymentSource) => {
    switch (source) {
      case PaymentSource.STRIPE:
        return 'bg-purple-100 text-purple-800';
      case PaymentSource.CHARGEBEE:
        return 'bg-blue-100 text-blue-800';
      case PaymentSource.PAYPAL:
        return 'bg-indigo-100 text-indigo-800';
      case PaymentSource.WIRE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filter payments by source
  const filteredPayments = filter === 'all'
    ? payments
    : payments.filter(payment => payment.paymentSource === filter);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Reconciliation</CardTitle>
        <CardDescription>
          Map unmatched payments to clients and create payment mappings.
        </CardDescription>
        
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-sm font-medium">Filter by source:</span>
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as PaymentSource | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {Object.values(PaymentSource).map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No unmatched payments found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={payment.sender}>
                    {payment.sender}
                  </TableCell>
                  <TableCell>
                    <Badge className={getSourceBadgeColor(payment.paymentSource)}>
                      {payment.paymentSource}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.amount.toFixed(2)} {payment.currency}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={selectedPayments[payment.id] || ''}
                      onValueChange={(value) => handleClientSelect(payment.id, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select client..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      disabled={!selectedPayments[payment.id]}
                      onClick={() => handleSaveMapping(payment.id)}
                    >
                      Map
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 