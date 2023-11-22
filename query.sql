-- query.sql
BEGIN;

-- Verify credit card number
SELECT balance FROM Bank_Account WHERE credit_card = '456789012345678';

-- Check for existing customer
SELECT customer_id FROM Customer
WHERE first_name = 'John' AND last_name = 'Doe' AND phone_number = '1234567890'
LIMIT 1
FOR UPDATE;

-- Trace: Begin to update customer info
UPDATE Customer
SET payment_method = 'Automatic', phone_plan = 'Post-paid'
WHERE customer_id = 1;
-- Trace: End to update customer info

-- Trace: Begin to update phone plan
SELECT COUNT(*) FROM Phone_Plan
WHERE customer_id = 1 AND phone_plan = 'Post-paid';
INSERT INTO Phone_Plan (customer_id, phone_plan)
VALUES (1, 'Post-paid')
ON CONFLICT (customer_id) DO NOTHING;
-- Trace: End to update phone plan

-- Trace: Begin to update payment method
SELECT COUNT(*) FROM Payment_Method
WHERE customer_id = 1 AND payment_method = 'Automatic';
INSERT INTO Payment_Method (customer_id, payment_method, bill_amount)
VALUES (1, 'Automatic', 0)
ON CONFLICT (customer_id) DO NOTHING;
-- Trace: End to update payment method

-- Trace: Begin to update data usage
INSERT INTO Data_Usage (customer_id, phone_number, call_time, call_date, call_cost, data_usage)
VALUES (1, '1234567890', '00:10:00', '2023-11-20', 5.00, 100)
ON CONFLICT (customer_id) DO UPDATE
SET call_time = '00:10:00', call_date = '2023-11-20', call_cost = 5.00, data_usage = Data_Usage.data_usage + 100;
-- Trace: End to update data usage

-- Trace: Begin to update costs
UPDATE Payment_Method
SET bill_amount = bill_amount + 5.00
WHERE customer_id = 1;
UPDATE Customer
SET bill_amount = bill_amount + 5.00
WHERE customer_id = 1;
-- Trace: End to update costs

-- Trace: Begin to update bank account
UPDATE Bank_Account
SET balance = balance - 5.00
WHERE credit_card = '456789012345678';
-- Trace: End to update bank account

-- Trace: Begin to update transaction
INSERT INTO Transactions (customer_id, transaction_date)
VALUES (1, CURRENT_DATE)
ON CONFLICT DO NOTHING
RETURNING t_id; 
-- Trace: End to update transaction

-- Trace: Begin to insert new customer info
INSERT INTO Customer(phone_number, first_name, last_name, payment_method, phone_plan, bill_amount, data_usage)
VALUES ('0987654321', 'Jane', 'Doe', 'Manual', 'Pre-paid', 0, 0)
RETURNING customer_id, bill_amount, data_usage;
-- Trace: End to update new customer info

-- Trace: Begin to update new phone plan
INSERT INTO Phone_Plan (customer_id, phone_plan)
VALUES (currval(pg_get_serial_sequence('customer', 'customer_id')), 'Pre-paid');
-- Trace: End to update new phone plan

-- Trace: Begin to update new payment method
INSERT INTO Payment_Method (customer_id, payment_method, bill_amount)
VALUES (currval(pg_get_serial_sequence('customer', 'customer_id')), 'Manual', 0);
-- Trace: End to update new payment method

-- Trace: Begin to update new data usage
INSERT INTO Data_Usage (customer_id, phone_number, call_time, call_date, call_cost, data_usage)
VALUES (currval(pg_get_serial_sequence('customer', 'customer_id')), '0987654321', '00:10:00', '2023-11-22', 5.00, 100);
-- Trace: End to update new data usage

-- Trace: Begin to update new costs
UPDATE Payment_Method
SET bill_amount = bill_amount + 5.00
WHERE customer_id = currval(pg_get_serial_sequence('customer', 'customer_id'));
UPDATE Customer
SET bill_amount = bill_amount + 5.00
WHERE customer_id = currval(pg_get_serial_sequence('customer', 'customer_id'));
-- Trace: End to update new costs

-- Trace: Begin to update bank account
UPDATE Bank_Account
SET balance = balance - 5.00
WHERE credit_card = '456789012345678';
-- Trace: End to update bank account

-- Trace: Begin to update new transaction
INSERT INTO Transactions (customer_id, transaction_date)
VALUES (currval(pg_get_serial_sequence('customer', 'customer_id')), CURRENT_DATE)
ON CONFLICT DO NOTHING
RETURNING t_id;
-- Trace: End to update new transaction

COMMIT;
