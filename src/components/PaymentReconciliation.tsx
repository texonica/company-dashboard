'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

interface Payment {
  id: string;
  name: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  client: {
    id: string | null;
    name: string;
  };
}

interface Subscription {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  status: string;
  billingCycle: string;
  client: {
    id: string | null;
    name: string;
  };
}

interface ReconciliationItem {
  date: string;
  client: string;
  expected: number;
  received: number;
  variance: number;
  currency: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
}

export default function PaymentReconciliation() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [reconciliation, setReconciliation] = useState<ReconciliationItem[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [dateRange, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Construct date range filter
      let dateFilter = '';
      if (dateRange.startDate && dateRange.endDate) {
        dateFilter = `&fromDate=${dateRange.startDate}&toDate=${dateRange.endDate}`;
      }
      
      // Fetch payments
      const paymentsRes = await fetch(`/api/payments?page=${page}&limit=${itemsPerPage}${dateFilter}`);
      const paymentsData = await paymentsRes.json();
      
      // Fetch subscriptions
      const subscriptionsRes = await fetch(`/api/subscriptions?page=${page}&limit=${itemsPerPage}${dateFilter}`);
      const subscriptionsData = await subscriptionsRes.json();
      
      // Ensure we always have arrays
      const paymentsArray = Array.isArray(paymentsData) ? paymentsData : [];
      const subscriptionsArray = Array.isArray(subscriptionsData) ? subscriptionsData : [];
      
      setPayments(paymentsArray);
      setSubscriptions(subscriptionsArray);
      
      // Process reconciliation data
      processReconciliation(paymentsArray, subscriptionsArray);
      
      // Calculate total pages (assuming the API returns the total count)
      setTotalPages(Math.ceil(paymentsArray.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching data:', error);
      setPayments([]);
      setSubscriptions([]);
      setReconciliation([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const processReconciliation = (payments: Payment[], subscriptions: Subscription[]) => {
    const reconciliationMap: Record<string, ReconciliationItem> = {};
    
    // Process expected payments from subscriptions
    subscriptions.forEach(sub => {
      const key = `${sub.client.name}-${sub.currency}`;
      
      if (!reconciliationMap[key]) {
        reconciliationMap[key] = {
          date: new Date().toISOString().split('T')[0], // Current date as default
          client: sub.client.name,
          expected: 0,
          received: 0,
          variance: 0,
          currency: sub.currency,
          status: 'pending'
        };
      }
      
      reconciliationMap[key].expected += sub.amount;
    });
    
    // Process received payments
    payments.forEach(payment => {
      const key = `${payment.client.name}-${payment.currency}`;
      
      if (!reconciliationMap[key]) {
        reconciliationMap[key] = {
          date: payment.date,
          client: payment.client.name,
          expected: 0,
          received: 0,
          variance: 0,
          currency: payment.currency,
          status: 'paid'
        };
      }
      
      reconciliationMap[key].received += payment.amount;
      reconciliationMap[key].date = payment.date; // Use most recent payment date
    });
    
    // Calculate variance and determine status
    const reconciliationItems = Object.values(reconciliationMap).map(item => {
      item.variance = item.received - item.expected;
      
      if (item.variance >= 0) {
        item.status = 'paid';
      } else if (item.received > 0) {
        item.status = 'partial';
      } else {
        item.status = 'overdue';
      }
      
      return item;
    });
    
    setReconciliation(reconciliationItems);
  };

  const handlePrevPage = () => {
    setPage(p => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setPage(p => Math.min(totalPages, p + 1));
  };

  const handleDateChange = (range: { startDate: string; endDate: string }) => {
    setDateRange(range);
    setPage(1); // Reset to first page when changing date range
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Reconciliation</CardTitle>
        <CardDescription>
          Compare expected vs. received payments
        </CardDescription>
        <div className="flex items-center justify-between">
          <DateRangePicker 
            onChange={handleDateChange} 
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="reconciliation">
            <TabsList>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
              <TabsTrigger value="expected">Expected Payments</TabsTrigger>
              <TabsTrigger value="received">Received Payments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reconciliation">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(reconciliation) && reconciliation.length > 0 ? reconciliation.map((item, index) => (
                    <TableRow key={`${item.client}-${item.currency}-${index}`}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.client}</TableCell>
                      <TableCell>{item.expected} {item.currency}</TableCell>
                      <TableCell>{item.received} {item.currency}</TableCell>
                      <TableCell className={item.variance < 0 ? 'text-red-500' : 'text-green-500'}>
                        {item.variance} {item.currency}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'paid' ? 'bg-green-100 text-green-800' :
                          item.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No reconciliation data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="expected">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Billing Cycle</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(subscriptions) ? subscriptions.map(sub => (
                    <TableRow key={sub.id}>
                      <TableCell>{sub.name}</TableCell>
                      <TableCell>{sub.client.name}</TableCell>
                      <TableCell>{sub.amount} {sub.currency}</TableCell>
                      <TableCell>{sub.billingCycle}</TableCell>
                      <TableCell>{sub.status}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">No subscription data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="received">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(payments) ? payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.name}</TableCell>
                      <TableCell>{payment.client.name}</TableCell>
                      <TableCell>{payment.amount} {payment.currency}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">No payment data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div>Page {page} of {totalPages}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page === totalPages || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 