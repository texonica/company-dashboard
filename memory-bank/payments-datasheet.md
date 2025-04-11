# Payments Datasheet Field Descriptions

1. **RecordID**: *String* - Unique identifier for each payment record, automatically generated.
2. **Title**: *String* - Descriptive title containing the date and client/project information for easy reference.
3. **Date**: *Date* - The date when the payment was made, formatted as YYYY-MM-DD.
4. **Value**: *Number* - The total amount of the payment in the original currency.
5. **Value_USD**: *Number* - The payment amount converted to USD for standardization.
6. **Currency**: *Select* - Currency code representing the payment's currency, options: EUR, USD.
7. **isPaid**: *Select* - Status indicating whether the payment has been completed or refunded, options: Yes, Refunded 100%.
8. **Payment_method**: *Select* - The method used for the payment, options: Stripe, Wire, PayPal, Upwork, S, w.
9. **Client**: *Link* - A link to the Clients table, associating the payment with a specific client.
10. **Project**: *Link* - A link to the Projects table, associating the payment with a specific project.
11. **Subscription**: *Link* - A link to the Subscriptions table, associating the payment with a specific subscription.
12. **ClientsID**: *Array* - An array of client record IDs linked to this payment.
13. **ProjectsID**: *Array* - An array of project record IDs linked to this payment.
14. **SubscriptionsID**: *Array* - An array of subscription record IDs linked to this payment.
15. **PaymentDirection**: *Enum* - Indicates the direction of the payment, options: DBIT (Debit), CRDT (Credit).
16. **PaymentSource**: *Enum* - Categorizes the source of the payment, options: Stripe, Wire, PayPal, Chargebee, Unknown.
17. **BankAccount**: *String* - Identifier for the bank account involved in the transaction.
18. **RawSender**: *String* - The original name of the sender, preserved for reference. 