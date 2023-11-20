-- Main table (contains all customer information)
CREATE TABLE Customer(
	customer_id SERIAL PRIMARY KEY,
	phone_number BIGINT NOT NULL UNIQUE,
	first_name VARCHAR(20),
	last_name VARCHAR(20),
	payment_method VARCHAR(10),
	phone_plan VARCHAR(20),
	bill_amount DECIMAL (10, 2),
	data_usage DECIMAL(10, 2) -- Represented in megabytes
);

-- Phone plan (contains only information about customer and their chosen plan)
CREATE TABLE Phone_Plan(
	customer_id SERIAL PRIMARY KEY,
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
	phone_plan VARCHAR(20),
);

-- Payment method (contains only information about customer and their method of payment)
CREATE TABLE Payment_Method(
	customer_id SERIAL PRIMARY KEY,
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
	payment_method VARCHAR(10),
	bill_amount DECIMAL (10, 2)
);

-- Data usage (contains only information about customer and the amount of data being used)
CREATE TABLE Data_Usage(
	customer_id SERIAL PRIMARY KEY,
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
	phone_number BIGINT NOT NULL UNIQUE,
	FOREIGN KEY (phone_number) REFERENCES Customer(phone_number),
	data_usage DECIMAL(10, 2),
	call_time INTERVAL, -- duration of the call
	call_cost DECIMAL (10, 2),
	call_date DATE
);
		   
-- Cell phone transactions (contains only information about customer id and their transaction record)
CREATE TABLE Transactions (
    t_id SERIAL PRIMARY KEY, -- transaction id
    customer_id SERIAL,
    transaction_date DATE,
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);

-- Function where customer can only create maximum of 100 transactions
CREATE OR REPLACE FUNCTION check_transaction_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM Transactions
        WHERE customer_id = NEW.customer_id
    ) >= 100 THEN
        RAISE EXCEPTION 'Customer has reached the maximum transaction limit of 100';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER before_transaction_insert
BEFORE INSERT ON Transactions
FOR EACH ROW
EXECUTE FUNCTION check_transaction_count();

CREATE TABLE Bank_Account(
	credit_card VARCHAR(15) PRIMARY KEY,
	balance DECIMAL(10, 2)
);

-- Insert money in bank
INSERT INTO Bank_Account(credit_card, balance)
VALUES ('123456789012345', 1000.00),
	   ('234567890123456', 500.00),
	   ('345678901234567', 750.00),
	   ('456789012345678', 1200.50),
	   ('567890123456789', 230.00);

