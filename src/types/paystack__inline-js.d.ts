declare module '@paystack/inline-js' {
  interface PaystackTransaction {
    reference: string;
    status: string;
    trans: string;
    transaction: string;
    message: string;
  }

  interface PaystackTransactionCallbacks {
    onSuccess: (transaction: PaystackTransaction) => void;
    onCancel: () => void;
  }

  // Open a new transaction (email + amount required)
  interface PaystackNewTransactionOptions extends PaystackTransactionCallbacks {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    metadata?: Record<string, unknown>;
  }

  // Resume an existing transaction initialised via the Paystack API
  interface PaystackAccessCodeOptions extends PaystackTransactionCallbacks {
    key: string;
    accessCode: string;
  }

  class PaystackPop {
    newTransaction(options: PaystackNewTransactionOptions | PaystackAccessCodeOptions): void;
  }

  export default PaystackPop;
}
