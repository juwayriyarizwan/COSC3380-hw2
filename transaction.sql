-- transaction.sql

-- Make a transaction
BEGIN;

-- Check for existing customer
SELECT customer_id FROM Customer
WHERE first_name = $1 AND last_name = $2 AND phone_number = $3
LIMIT 1
FOR UPDATE;

-- Update Customer table
UPDATE Customer
SET payment_method = $4, phone_plan = $5
WHERE customer_id = $6;

-- Update Phone Plan table
SELECT COUNT(*)
FROM Phone_Plan
WHERE customer_id = $6 AND phone_plan = $5;
INSERT INTO Phone_Plan (customer_id, phone_plan)
VALUES ($6, $5)
ON CONFLICT (customer_id) DO NOTHING;

-- Update Payment Method table
SELECT COUNT(*)
FROM Payment_Method
WHERE customer_id = $6 AND payment_method = $4;
INSERT INTO Payment_Method (customer_id, payment_method, bill_amount)
VALUES ($6, $4, 0)
ON CONFLICT (customer_id) DO NOTHING;

-- Update Data Usage table 
INSERT INTO Data_Usage (customer_id, phone_number, call_time, call_date, call_cost, data_usage)
VALUES ($6, $3, $7, $8, $9, $10)
ON CONFLICT (customer_id) DO UPDATE
SET call_time = $7, call_date = $8, call_cost = $9, data_usage = $10;

-- Update costs
UPDATE Payment_Method
SET bill_amount = bill_amount + $9
WHERE customer_id = $6;
UPDATE Customer
SET bill_amount = bill_amount + $9
WHERE customer_id = $6;

-- Update Bank Account
UPDATE Bank_Account
SET balance = balance - $9
WHERE credit_card = '456789012345678';

-- Update Transactions table
INSERT INTO Transactions (customer_id, transaction_date)
VALUES ($6, CURRENT_DATE)
ON CONFLICT DO NOTHING
RETURNING t_id; 

-- For new customer
INSERT INTO Customer(phone_number, first_name, last_name, payment_method, phone_plan, bill_amount, data_usage)
VALUES ($3, $1, $2, $4, $5, 0, 0)
RETURNING customer_id, bill_amount, data_usage;

-- Update Phone Plan table
INSERT INTO Phone_Plan (customer_id, phone_plan)
VALUES (currval(pg_get_serial_sequence('customer', 'customer_id')), $5);

-- Update Payment Method table
INSERT INTO Payment_Method (customer_id, payment_method, bill_amount)
VALUES (currval(pg_get_serial_sequence('customer', 'customer_id')), $4, 0)

-- Update Data Usage table 
INSERT INTO Data_Usage (customer_id, phone_number, call_time, call_date, call_cost, data_usage)
VALUES (currval(pg_get_serial_sequence('customer', 'customer_id')), $3, $7, $8, $9, $10);

-- Update Transactions table
INSERT INTO Transactions (customer_id, transaction_date)
VALUES (currval(pg_get_serial_sequence('customer', 'customer_id')), CURRENT_DATE)
ON CONFLICT DO NOTHING
RETURNING t_id;

COMMIT;
