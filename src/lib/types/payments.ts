// src/lib/types/payments.ts
// Payment-related type definitions

export enum PaymentDirection {
  DEBIT = 'DBIT',
  CREDIT = 'CRDT'
}

export enum PaymentSource {
  STRIPE = 'Stripe',
  WIRE = 'Wire',
  PAYPAL = 'PayPal',
  CHARGEBEE = 'Chargebee',
  UNKNOWN = 'Unknown'
}

export interface PaymentSchema {
  Name: string;
  Date: string;
  Amount: number;
  PaymentDirection: PaymentDirection;
  PaymentMethod: string;
  Currency: string;
  Description: string;
  Sender: string;
  RawSender: string; // Preserve original sender name
  ChargebeeId?: string;
  CustomerEmail?: string;
  Subscription?: string; // Optional field for subscription record ID
  Client?: string | string[]; // Client record ID(s)
  Project?: string | string[]; // Project record ID(s)
  PaymentSource: PaymentSource;
  BankAccount: string;
  TransactionId?: string; // External transaction identifier
}

export interface ProcessedPayment {
  transactionType: PaymentDirection;
  sender: string;
  rawSender: string;
  description: string;
  bankAccount: string;
  date: string;
  amount: number;
  currency: string;
  chargebeeId?: string;
  customerEmail?: string;
  paymentSource: PaymentSource;
  transactionId?: string;
}

export interface CSVRow {
  '': string; // Transaction type (DBIT/CRDT)
  'Sender/receiver': string;
  'Description': string;
  'Bank account': string;
  'Date': string;
  'Amount': string;
  'Currency': string;
}

export interface ImportResult {
  total: number;
  imported: number;
  failed: number;
  matched: number;
  unmatched: number;
  errors: string[];
}

export interface ClientMapping {
  senderId: string; // Normalized sender name used as key
  rawSender: string; // Original sender name
  clientId: string; // AITable client record ID
  confidence: number; // Match confidence (0-100)
  lastUsed: string; // ISO date string
  paymentSource: PaymentSource;
  usageCount: number; // How many times this mapping has been used
} 