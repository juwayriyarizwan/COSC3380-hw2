DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Phone_Plan;
DROP TABLE IF EXISTS Payment_Method;
DROP TABLE IF EXISTS Data_Usage
DROP TABLE IF EXISTS Transactions;

-- Main table (contains all customer information)
CREATE TABLE Customer(
	customer_id INT NOT NULL PRIMARY KEY,
	phone_number INT NOT NULL UNIQUE,
	first_name VARCHAR(20),
	last_name VARCHAR(20),
	payment_method VARCHAR(10),
	phone_plan VARCHAR(20),
	bill_amount DECIMAL (10, 2),
	call_time TIME, 
	data_usage DECIMAL(10, 2) -- Represented in megabytes
);

-- Demo info
INSERT INTO Customer (customer_id, phone_number, first_name, last_name, payment_method, phone_plan, bill_amount, data_usage)
VALUES (1, 1234567890, 'John', 'Doe', 'Automatic', 'Post-paid', 50.00, 1024.50);

-- Phone plan (contains only information about customer and their chosen plan)
CREATE TABLE Phone_Plan(
	customer_id INT NOT NULL PRIMARY KEY,
	FOREIGN KEY (customer_id) REFERENCES Customer_Info(customer_id),
	phone_number INT NOT NULL UNIQUE,
	FOREIGN KEY (phone_number) REFERENCES Customer_Info(phone_number),
	phone_plan VARCHAR(20)
);

-- The two types of phone plan
INSERT INTO Phone_Plan (phone_plan)
	VALUES('Pre-paid'), ('Post-paid');
	
-- Payment method (contains only information about customer and their method of payment)
CREATE TABLE Payment_Method(
	customer_id INT NOT NULL PRIMARY KEY,
	FOREIGN KEY (customer_id) REFERENCES Customer_Info(customer_id),
	phone_number INT NOT NULL UNIQUE,
	FOREIGN KEY (phone_number) REFERENCES Customer_Info(phone_number),
	payment_method VARCHAR(10),
	bill_amount DECIMAL (10, 2),
);

-- The 2 types of payment methods
INSERT INTO Payment_Method (payment_method)
	VALUES ('Automatic'), ('Manual');

-- Data usage (contains only information about customer and the amount of data being used)
CREATE TABLE Data_Usage(
	customer_id INT NOT NULL PRIMARY KEY,
	FOREIGN KEY (customer_id) REFERENCES Customer_Info(customer_id),
	phone_number INT NOT NULL UNIQUE,
	FOREIGN KEY (phone_number) REFERENCES Customer_Info(phone_number),
	data_usage DECIMAL(10, 2),
	call_time TIME, 
	call_cost DECIMAL (10, 2)
);

-- Cell phone transactions (contains only information about customer id and their transaction record)
CREATE TABLE Transactions (
    t_id INT,
    customer_id INT NOT NULL PRIMARY KEY,
	FOREIGN KEY (customer_id) REFERENCES Customer_Info(customer_id),
    services_id INT, -- our product id
    transaction_date DATE
);

-- demo
INSERT INTO CellPhoneTransactions (transaction_id, customer_id, services_id, transaction_date)
VALUES		(1, 1, 1, '2023-10-25'),
			(2, 1, 2, '2023-10-26'),
			(3, 2, 1, '2023-10-27');