
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';
// Stripe service removed
import { Download, Filter, Calendar, CreditCard, FileText, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amount: number;
  currency: string;
  created: number;
  due_date: number | null;
  paid: boolean;
  invoice_pdf: string;
  hosted_invoice_url: string;
  customer_email: string;
  description: string;
  lines: {
    data: Array<{
      description: string;
      amount: number;
      quantity: number;
    }>;
  };
}

interface Charge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  description: string;
  receipt_url: string;
  paid: boolean;
  refunded: boolean;
  customer: string;
}

const BillingTab = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'invoices' | 'charges'>('overview');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      loadBillingData();
    }
  }, [currentUser]);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      // Stripe service removed - using mock data
      const subData = null;
      setSubscription(subData);

      // Mock data for invoices and charges - in real implementation, these would come from Stripe API
      const mockInvoices: Invoice[] = [
        {
          id: 'in_1234567890',
          number: 'INV-001',
          status: 'paid',
          amount: 2997,
          currency: 'usd',
          created: Date.now() / 1000 - 86400 * 30,
          due_date: Date.now() / 1000 - 86400 * 25,
          paid: true,
          invoice_pdf: 'https://example.com/invoice.pdf',
          hosted_invoice_url: 'https://example.com/invoice',
          customer_email: currentUser!.email!,
          description: 'AI Receptionist Monthly Subscription',
          lines: {
            data: [
              {
                description: 'AI Receptionist Plan',
                amount: 2997,
                quantity: 1
              }
            ]
          }
        },
        {
          id: 'in_0987654321',
          number: 'INV-002',
          status: 'open',
          amount: 497,
          currency: 'usd',
          created: Date.now() / 1000 - 86400 * 5,
          due_date: Date.now() / 1000 + 86400 * 10,
          paid: false,
          invoice_pdf: 'https://example.com/invoice2.pdf',
          hosted_invoice_url: 'https://example.com/invoice2',
          customer_email: currentUser!.email!,
          description: 'Business Plan Upgrade',
          lines: {
            data: [
              {
                description: 'Business Plan',
                amount: 497,
                quantity: 1
              }
            ]
          }
        }
      ];

      const mockCharges: Charge[] = [
        {
          id: 'ch_1234567890',
          amount: 2997,
          currency: 'usd',
          status: 'succeeded',
          created: Date.now() / 1000 - 86400 * 30,
          description: 'AI Receptionist Monthly',
          receipt_url: 'https://example.com/receipt.pdf',
          paid: true,
          refunded: false,
          customer: 'cus_example123'
        },
        {
          id: 'ch_0987654321',
          amount: 497,
          currency: 'usd',
          status: 'succeeded',
          created: Date.now() / 1000 - 86400 * 5,
          description: 'Business Plan Upgrade',
          receipt_url: 'https://example.com/receipt2.pdf',
          paid: true,
          refunded: false,
          customer: 'cus_example123'
        }
      ];

      setInvoices(mockInvoices);
      setCharges(mockCharges);
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast({
        title: "Error",
        description: "Failed to load billing information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoicePDF = async (invoice: Invoice) => {
    try {
      // In real implementation, this would call Stripe API to get the actual PDF
      window.open(invoice.invoice_pdf, '_blank');
      toast({
        title: "Success",
        description: "Invoice PDF download started.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download invoice PDF.",
        variant: "destructive",
      });
    }
  };

  const downloadReceipt = async (charge: Charge) => {
    try {
      window.open(charge.receipt_url, '_blank');
      toast({
        title: "Success",
        description: "Receipt download started.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download receipt.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
      case 'succeeded':
        return 'default';
      case 'open':
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'void':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const filterData = (data: any[], type: 'invoice' | 'charge') => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type === 'invoice' && item.number?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const itemDate = new Date(item.created * 1000);
        const now = new Date();
        switch (dateFilter) {
          case 'last30':
            matchesDate = itemDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'last90':
            matchesDate = itemDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'lastYear':
            matchesDate = itemDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const filteredInvoices = filterData(invoices, 'invoice');
  const filteredCharges = filterData(charges, 'charge');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading billing information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeView === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveView('overview')}
          className="flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Overview
        </Button>
        <Button
          variant={activeView === 'invoices' ? 'default' : 'outline'}
          onClick={() => setActiveView('invoices')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Invoices ({invoices.length})
        </Button>
        <Button
          variant={activeView === 'charges' ? 'default' : 'outline'}
          onClick={() => setActiveView('charges')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Charges ({charges.length})
        </Button>
      </div>

      {/* Filters */}
      {(activeView === 'invoices' || activeView === 'charges') && (
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
              <SelectItem value="lastYear">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {activeView === 'invoices' && (
                <>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </>
              )}
              {activeView === 'charges' && (
                <>
                  <SelectItem value="succeeded">Succeeded</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={loadBillingData}
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}

      {/* Overview */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Your active plan and billing information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Plan</span>
                  <Badge variant="default">
                    {subscription?.planId ? 'Premium Plan' : 'Free Plan'}
                  </Badge>
                </div>
                {subscription && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Status</span>
                      <Badge variant={getStatusBadgeVariant(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Next Billing</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </>
                )}
                <Separator />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast({ title: "Coming Soon", description: "Subscription management is coming soon." })}
                >
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
            <CardHeader>
              <CardTitle>Billing Summary</CardTitle>
              <CardDescription>Overview of your recent billing activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Invoices</span>
                  <span className="text-lg font-bold">{invoices.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Paid Invoices</span>
                  <span className="text-lg font-bold text-green-600">
                    {invoices.filter(inv => inv.paid).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Outstanding</span>
                  <span className="text-lg font-bold text-orange-600">
                    {invoices.filter(inv => !inv.paid).length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Charges</span>
                  <span className="text-lg font-bold">{charges.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invoices View */}
      {activeView === 'invoices' && (
        <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>
              View and download your invoices ({filteredInvoices.length} of {invoices.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{format(new Date(invoice.created * 1000), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{formatAmount(invoice.amount, invoice.currency)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadInvoicePDF(invoice)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(invoice.hosted_invoice_url, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredInvoices.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No invoices found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Charges View */}
      {activeView === 'charges' && (
        <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
          <CardHeader>
            <CardTitle>Charges</CardTitle>
            <CardDescription>
              View your payment history ({filteredCharges.length} of {charges.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCharges.map((charge) => (
                  <TableRow key={charge.id}>
                    <TableCell>{format(new Date(charge.created * 1000), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{charge.description}</TableCell>
                    <TableCell>{formatAmount(charge.amount, charge.currency)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(charge.status)}>
                        {charge.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReceipt(charge)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredCharges.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No charges found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillingTab;
