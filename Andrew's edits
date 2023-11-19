const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const creds = require('./creds.json');
const pool = new Pool(creds);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Customer ID/Phone Number in main page
app.get('/', async (req, res) =>{
    const customerId = req.query.customerId;
    const phoneNumber = req.query.phoneNum;
    let transactionsHtml = "";  // Store html content displaying transaction info
    let totalPrice = 0; // total price of all transactions for a customer
    let customerName = "";  // store name of customer of those transactions being displayed
    // If customer id is present
    if(customerId || phoneNumber)
    {
        // Get customer transactions
        try{
            // database query joins customer, payment method, phone plan, and data usage tables
            let query = `
              SELECT
                t.t_id,
                t.transaction_date,
                t.customer_id,
                c.first_name AS customer_fn,
                c.last_name AS customer_ln,
                p.payment_method,
                pp.phone_plan,
                du.data_usage,
                du.call_time,
                du.call_cost
              FROM
                Transactions t
              JOIN
                Customer c ON t.customer_id = c.customer_id
              LEFT JOIN
                Payment_Method p ON t.customer_id = p.customer_id
              LEFT JOIN
                Phone_Plan pp ON t.customer_id = pp.customer_id
              LEFT JOIN
                Data_Usage du ON t.customer_id = du.customer_id
            `;
            const queryParams = [];
            // Allow user to input either id or number
            if(customerId){
                query += " WHERE t.customer_id = $1";
                queryParams.push(customerId);
            }
            else if(phoneNumber){
                query += " WHERE c.phone_number = $1";
                queryParams.push(phoneNumber);
            }
            query += " ORDER BY t.transaction_date DESC LIMIT 1;";
            const result = await pool.query(query, queryParams);

            if(result.rows.length > 0){
                customerName = `${result.rows[0].customer_fn} ${result.rows[0].customer_ln}`;
                transactionsHtml = result.rows.map(row => {
                    totalPrice += row.call_cost;
                    const callTime = row.call_time;
                    const timeFormat = callTime ? callTime.toISOString().substr(11, 8) : "N/A";
                    // Print transactions on wepage
                    return `
                     <p>Transaction ID: ${row.t_id},  Date: ${row.transaction_date}, Data Usage: ${row.data_usage} MB, Call Time: ${timeFormat}, Call Cost: $${row.call_cost}</p>`;
                
                }).join('');
            }
        }
        
        // Error
        catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    }
    // Transactions displayed on webpage:
    res.send(`
        <!DOCTYPE html>
            <html lang = "en">
                <head>
                    <meta charset="UTF-8"> 
                    <link rel="stylesheet" type="text/css" href="style.css">
                    <meta name = "viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Cell Phone Company </title> 
                    <style>
                        body {
                            padding-top: 5em;
                            display: flex;
                            justify-content: center;
                        }
                        /*Page Gradient*/
                        body.bg-gradient{
                            height: 100vh;
                            width: 100%; /* Add this line to make the gradient fill the entire width */
                            background: linear-gradient(to bottom, #00ccff 0%, #000099 100%);
                        }
                        /*typewriter effect for all headers*/
                        h1{
                            color: #ffffff; /* Set text color to white */
                            font-family: monospace;
                            overflow: hidden;
                            border-right: .15em solid rgb(255, 255, 255);
                            white-space: nowrap;
                            letter-spacing: .15em;
                            animation: typing 2.5s steps(40, end), blink-caret 1.5s step-end infinite;
                            height: 1.2em;
                            text-align: center;
                        }
                        /* The typing effect */
                        @keyframes typing {
                            from { width: 0 }
                            to { width: 100% }
                        }
                        /* The typewriter cursor effect */
                        @keyframes blink-caret {
                            from, to { border-color: transparent }
                            50% { border-color: rgb(255, 255, 255); }
                        }
                        p {
                            text-align: center;
                            color: white;
                            font-family: monospace;
                            letter-spacing: .15em;
                        }
                        /*CustomerID, first name*/
                        .customerId, .firstname, .lastname, .phonenum, .phoneplan, .payplan{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                        }
                        /* Container for positioning */
                        .content-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                        }
                        /*Button to view transactions and customer info*/
                        .button, .buttoninfo{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                        /*Button for customer info page*/
                        .buttoninfo{
                            top: 60%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .button:hover, .buttoninfo:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        p{ /*Please enter your CustomerID*/
                            position: absolute;
                            top: 18%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .customerId{ /*User input*/
                            font-family: monospace;
                            position: absolute;
                            top: 30%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .transactions{ /*Transactions*/
                            color: white;
                            position: absolute;
                            font-family: monospace;
                            letter-spacing: .15em;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .transaction-item{ /*Listed transactions*/
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 450px;
                            right: -150px;
                            width: 100%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .servicelinks{
                            display: flex;
                            gap: 2rem;
                            align-items: center;
                            font-family: monospace;
                            position: absolute;
                            top: 45%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phonenum{
                            font-family: monospace;
                            position: absolute;
                            top: 35%;
                            left: 50%;      
                            transform: translate(-50%, -50%);
                        }
                        .readme{
                            font-family: monospace;
                            position: absolute;
                            top: 21.7%;
                            left: 50%;      
                            transform: translate(-50%, -50%);
                        }
                    </style>
                </head>
                <body class="bg-gradient">
                    <div class="intro">
                        <h1>HW2: Cell Phone Company</h1> 
                    </div>
                    <br><br>
                    <p>Please enter your CustomerID.</p>
                    <!--Enter CustomerID-->
                <form action = "/" method = "GET">
                    <div class="customerId">
                            <strong><label for = "customerid"><b>CustomerID:</b></label></strong>
                            <br>
                            <input type="text" name="customerId" id="customerid" maxlength="3">
                            <h3>OR</h3>
                            <br><br>
                        </div>
                    <!--Phone number-->
                    <div class="phonenum">
                            <strong><label for = "phoneNum"><b>Phone Number:</b></label></strong>
                            <br>
                            <input type="text" name="phoneNum" id="phonenum" maxlength="10">
                            <br><br>
                        </div>
                    <!--Click Get Transactions to view transactions-->
                    <div class="button">
                        <button type = "submit"> View Transactions</button>
                    </div>
                </form>
                    <!--Go to a new page to allow transaction for a customer, see all payment methods, etc.-->
                    <div class = "servicelinks">
                        <span><a href="cellphoneservices.html" style="color: white;">Buy Services</a></span>
                        <span><a href="paymentmethod.html" style="color: white;">Payment Methods</a></span>
                        <span><a href="phoneplans.html" style="color: white;">Phone Plans</a></span>
                        <span><a href="datausage.html" style="color: white;">Data Usage</a></span>
                        <span><a href="deleterows.html" style="color: white;">Delete all rows</a></span>
                    </div>
                    <div class = "readme"><span><a href="hw2.README" style="color: white;">README</a></span></div>
                    <div class="transactions">
                        <h3>Transactions:</h3>
                    </div>
                    <div class="transaction-item">
                        ${transactionsHtml}
                    </div>
                    <!--Link JS file-->
                    <script src="hw2.js"></script>
                </body>
            </html>
    `);
});

// Mbps
const dataRate = 3.0;
const perMB = 0.05;
// Parse call duration
function parseDuration(duration){
    const time = duration.split(":");
    if(time.length == 3){
        const hours = parseInt(time[0], 10);
        const minutes = parseInt(time[1], 10);
        const seconds = parseInt(time[2], 10);
        return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
}
// Calculate MB
function calculateDataUsage(callDuration, dataRate){
    const durationssecs = parseDuration(callDuration);
    const dataRateMbps = dataRate / 1000;
    // Convert to MB
    const MBdata = (durationssecs * dataRateMbps) / 8;
    return MBdata;
}
// Calculate cost of call
function calculateCallCost(callDuration, dataRate, perMB){
    const perMin = 0.01;
    const callDurationsecs = parseDuration(callDuration);
    // Calculate MB
    const MBdata = calculateDataUsage(callDuration, dataRate);
    // Cost of data usage
    const dataCost = MBdata * perMB;
    const callCost = (callDurationsecs / 60) * perMin + dataCost;
    return callCost;
}

// Add new customers
async function insertCustomer(readData, res, callduration, creditcard){
    const userInput = await pool.connect();
    let customerId;
    let BillAmount;
    let dataUsage;
    try{
        await userInput.query('BEGIN');

        // Check if there is an existing customer
        const checkExistingCust = `
            SELECT customer_id FROM Customer
            WHERE first_name = $1 AND last_name = $2 AND phone_number = $3
            LIMIT 1;
        `;
        const existingCust = await userInput.query(checkExistingCust, [readData.firstname, readData.lastname, readData.phonenum]);
        // If customer exists, use same customer id
        if(existingCust.rows.length > 0){
            // Update the existing records
            customerId = existingCust.rows[0].customer_id;

            // Calculate cost of call
            const callCost = calculateCallCost(callduration, dataRate, perMB);
            // Calculate data usage
            dataUsage = calculateDataUsage(callduration, dataRate);
            const updateCustomerInfo = `
            UPDATE Customer
            SET payment_method = $1, phone_plan = $2
            WHERE customer_id = $3;
            `;
            const updateCustomerData = [
                readData.pay,
                readData.plans,
                customerId
            ];

            await userInput.query(updateCustomerInfo, updateCustomerData);

            // Update phone plan table
            const checkPhonePlan = `
            SELECT COUNT(*)
            FROM Phone_Plan
            WHERE customer_id = $1 AND phone_plan = $2;
            `;
            // If existing customer wants to change their phone plan
            const phonePlanCount = await userInput.query(checkPhonePlan, [customerId, readData.plans]);
            if (phonePlanCount.rows[0].count === 0) {
                const insertPhone = `
                    INSERT INTO Phone_Plan (customer_id, first_name, last_name, phone_number, phone_plan)
                    VALUES ($1, $2, $3, $4, $5);
                `;
                const phoneData = [
                    customerId,
                    readData.firstname,
                    readData.lastname,
                    readData.phonenum,
                    readData.plans
                ];
                await userInput.query(insertPhone, phoneData);
            }
            else{
                // If phone plan exists, update the existing record
                const updatePhonePlan = `
                UPDATE Phone_Plan
                SET phone_plan = $1
                WHERE customer_id = $2;
                `;
                const updatePhonePlanData = [
                    readData.plans,
                    customerId
                ];
                await userInput.query(updatePhonePlan, updatePhonePlanData);
            }

            // Update payment method table
            const checkPayment = `
            SELECT COUNT(*)
            FROM Payment_Method
            WHERE customer_id = $1 AND payment_method = $2;
            `;
            // If existing customer wants to change their payment method
            const paymentMethodCount = await userInput.query(checkPayment, [customerId, readData.pay]);
            if (paymentMethodCount.rows[0].count === 0) {
                const insertPayment = `
                    INSERT INTO Payment_Method (customer_id, phone_number, payment_method, bill_amount)
                    VALUES ($1, $2, $3, $4);
                `;
                const paymentData = [
                    customerId,
                    readData.phonenum,
                    readData.pay,
                    0,  // Initial bill amount
                ];
                await userInput.query(insertPayment, paymentData);
            }
            else{
                // If payment method exists, update the existing record
                const updatePaymentMethod = `
                UPDATE Payment_Method
                SET payment_method = $1
                WHERE customer_id = $2;
                `;
                const updatePaymentMethodData = [
                    readData.pay,
                    customerId
                ];
                await userInput.query(updatePaymentMethod, updatePaymentMethodData);
            }

            // Update data usage table
            const insertUsage = `
                INSERT INTO Data_Usage (customer_id, phone_number, call_time, call_date, call_cost, data_usage)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (customer_id) DO UPDATE
                SET call_time = $3, call_date = $4, call_cost = $5, data_usage = Data_Usage.data_usage + $6
                RETURNING *;
            `;
            const usageData = [
                customerId,
                readData.phonenum,
                callduration,
                readData.calldate,
                callCost,
                0, //initial data usage amount
            ];
            await userInput.query(insertUsage, usageData);
            // Add the cost onto the total amount on payment method table
            const updateBill = `
                UPDATE Payment_Method
                SET bill_amount = bill_amount + $1
                WHERE customer_id = $2;
            `;
            const updateBillData = [
                callCost, 
                customerId
            ];
            await userInput.query(updateBill, updateBillData);
            // Add the cost onto the total amount on customer table
            const updateCustBill = `
                UPDATE customer
                SET bill_amount = bill_amount + $1
                WHERE customer_id = $2;
            `;
            const customerBillAmount = [
                callCost,
                customerId
            ];
            await userInput.query(updateCustBill, customerBillAmount);
            BillAmount = callCost;

            // Update transaction table
            const insertTransaction = `
            INSERT INTO Transactions (customer_id, transaction_date)
            VALUES ($1, CURRENT_DATE)
            ON CONFLICT DO NOTHING
            RETURNING t_id;
            `;
            
            const transactionData = [
                customerId,
            ];
            const transactionResult = await userInput.query(insertTransaction, transactionData);
            const transactionId = transactionResult.rows[0].t_id;

            await userInput.query('COMMIT');
        }
        // Continue to insert a new customer
        else{
            // Calculate cost of call
            const callCost = calculateCallCost(callduration, dataRate, perMB);
            // Calculate data usage
            const dataUsage = calculateDataUsage(callduration, dataRate);
            const insertInfo = `
            INSERT INTO Customer (phone_number, first_name, last_name, payment_method, phone_plan, bill_amount, data_usage)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING customer_id, bill_amount, data_usage;
            `;
            const customerData = [
                readData.phonenum,
                readData.firstname,
                readData.lastname,
                readData.pay,
                readData.plans,
                0,
                dataUsage,
            ];

            const result = await userInput.query(insertInfo, customerData);
            customerId = result.rows[0].customer_id;

            // Update phone plan table
            const insertPhone = `
            INSERT INTO Phone_Plan (customer_id, first_name, last_name, phone_number, phone_plan)
            VALUES ($1, $2, $3, $4, $5);
            `;
            const phoneData = [
                customerId,
                readData.firstname,
                readData.lastname,
                readData.phonenum,
                readData.plans
            ];
            await userInput.query(insertPhone, phoneData);
            // Update payment method table
            const insertPayment = `
                INSERT INTO Payment_Method (customer_id, phone_number, payment_method, bill_amount)
                VALUES ($1, $2, $3, $4);
            `;
            const paymentData = [
                customerId,
                readData.phonenum,
                readData.pay,
                0,  // Initial bill amount
            ];
            await userInput.query(insertPayment, paymentData);

            // Update data usage table
            const insertUsage = `
            INSERT INTO Data_Usage (customer_id, phone_number, call_time, call_date, call_cost, data_usage)
            VALUES ($1, $2, $3, $4, $5, $6);
            `;
            const usageData = [
                customerId,
                readData.phonenum,
                callduration,
                readData.calldate,
                callCost,
                0, //initial data usage amount
            ];
            await userInput.query(insertUsage, usageData);
            // Add the cost onto the total amount on payment method table
            const updateBill = `
                UPDATE Payment_Method
                SET bill_amount = bill_amount + $1
                WHERE customer_id = $2;
            `;
            const updateBillData = [
                callCost, 
                customerId
            ];
            await userInput.query(updateBill, updateBillData);
            // Add the cost onto the total amount on customer table
            const updateCustBill = `
                UPDATE customer
                SET bill_amount = bill_amount + $1
                WHERE customer_id = $2;
            `;
            const customerBillAmount = [
                callCost,
                customerId
            ];
            await userInput.query(updateCustBill, customerBillAmount);
            BillAmount = callCost;

            await userInput.query('COMMIT');
        }

        // Update transaction table
        const insertTransaction = `
            INSERT INTO Transactions (customer_id, transaction_date)
            VALUES ($1, CURRENT_DATE)
            RETURNING t_id;
        `;
        const transactionData = [
            customerId,
        ];
        const transactionResult = await userInput.query(insertTransaction, transactionData);
        const transactionId = transactionResult.rows[0].t_id;
        await userInput.query('COMMIT');
        return {customerId, transactionId, BillAmount, dataUsage};
    }catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).send("Transaction error: " + error.message); 
        throw error;
    } finally {
        userInput.release();
    }
}

// Link to buy services
app.get('/cellphoneservices.html', async (req, res) => {
    // GET request
    res.send(`
            <!DOCTYPE html>
            <html lang = "en">
                <head>
                    <meta charset="UTF-8"> 
                    <meta name = "viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" type="text/css" href="style.css">
                    <title>Cell Phone Company </title> 
                    <style>
                        body {
                            padding-top: 5em;
                            display: flex;
                            justify-content: center;
                        }
                        /*Page Gradient*/
                        body.bg-gradient{
                            height: 109vh;
                            width: 100%; /* Add this line to make the gradient fill the entire width */
                            background: linear-gradient(to bottom, #00ccff 0%, #000099 100%);
                        }
                        /*typewriter effect for all headers*/
                        h1{
                            color: #ffffff; /* Set text color to white */
                            font-family: monospace;
                            overflow: hidden;
                            border-right: .15em solid rgb(255, 255, 255);
                            white-space: nowrap;
                            letter-spacing: .15em;
                            animation: typing 2.5s steps(40, end), blink-caret 1.5s step-end infinite;
                            height: 1.2em;
                            text-align: center;
                        }
                        /* The typing effect */
                        @keyframes typing {
                            from { width: 0 }
                            to { width: 100% }
                        }
                        /* The typewriter cursor effect */
                        @keyframes blink-caret {
                            from, to { border-color: transparent }
                            50% { border-color: rgb(255, 255, 255); }
                        }
                        p {
                            text-align: center;
                            color: white;
                            font-family: monospace;
                        }
                        /*CustomerID, first name*/
                        .customerId, .firstname, .lastname, .phonenum, .phoneplan, .payplan{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                        }
                        /* Container for positioning */
                        .content-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                        }
                        /*Button to view transactions and customer info*/
                        .button, .buttoninfo{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                        /*Button for Home Button*/
                        .button2, .homeinfo{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 55%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                        /*Button for Home button*/
                        .homeinfo{
                            top: 73%;
                            left: 54.5%;
                            transform: translate(-50%, -50%);
                        }
                        /*Button for customer info page*/
                        .buttoninfo{
                            top: 73%;
                            left: 44%;
                            transform: translate(-50%, -50%);
                        }
                        .button:hover, .buttoninfo:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        .button:hover, .homeinfo:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        .firstname{
                            position: absolute;
                            top: 25%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .lastname{
                            position: absolute;
                            top: 30%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phonenum{
                            position: absolute;
                            top: 35%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phoneplan{
                            position: absolute;
                            top: 43%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .payplan{
                            position: absolute;
                            top: 48%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .viewService{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 75%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .tinyheader{
                            position: absolute;
                            top: 15%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .calldate{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 53%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .callduration{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 59.5%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .creditcard{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 66%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                    </style>
                </head>
                <body class="bg-gradient">
                    <!--Typewriter customer info-->
                    <div class="custinfo">
                        <h1>Customer Information</h1> 
                    </div>
                    <br><br>
                    <div class = "tinyheader">
                    <br><br>
                    <br><br>
                    <p>Make a transaction</p>
                    </div>
                    <form action = "/cellphoneservices.html" method = "POST">
                    <!--Enter First and Last name-->
                    <div class="firstname">
                        <strong><label for = "firstName"><b>First name:</b></label></strong>
                        <br>
                        <input type="text" name="firstname" id="firstname" maxlength="20" required>
                        <br><br>
                    </div>
                    <div class="lastname">
                        <strong><label for = "lastName"><b>Last name:</b></label></strong>
                        <br>
                        <input type="text" name="lastname" id="lastname" maxlength="20" required>
                        <br><br>
                    </div>
                    <!--Phone number-->
                    <div class="phonenum">
                        <strong><label for = "phoneNum"><b>Phone Number:</b></label></strong>
                        <br>
                        <input type="text" name="phonenum" id="phonenum" maxlength="10" required>
                        <br><br>
                    </div>
                    <!--Choose phone plan-->
                    <div class="phoneplan">
                        <strong><label for = "phonePlan"><b>Select your Phone Plan:</b></label></strong>
                        <br>
                        <select name = "plans" id = "plans">
                            <option value="Post-paid">Post-paid</option>
                            <option value="Pre-paid">Pre-paid</option>
                        </select>
                        <br><br>
                    </div>
                    <!--Choose payment method-->
                    <div class="payplan">
                        <strong><label for = "payPlan"><b>Select your Payment Method:</b></label></strong>
                        <br>
                        <select name = "pay" id = "pay">
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>
                        <br><br>
                    </div>
                    <!--Enter call date-->
                    <div class = "calldate">
                        <strong><label for = "calldate"><b>Enter your Call Date:</b></label></strong>
                        <br>
                        <input type="date" name="calldate" placeholder="DD-MM-YYYY" value="" min="1997-01-01" max="2030-12-31">
                    </div>
                    <!--Enter call duration-->
                    <div class="callduration">
                        <strong><label for="callduration"><b>Enter Call Duration:</b></label></strong>
                        <br>
                        <input type="text" name="callduration" placeholder="HH:MM:SS" value="">
                    </div>
                    <div class="creditcard">
                        <strong><label for="creditcard"><b>Enter Credit Card Number:</b></label></strong>
                        <br>
                        <input type="text" name="creditcard" value="" maxlength="16" required>
                    </div>
                    <div class="buttoninfo">
                        <button type = "submit"> View Transaction </button>
                    </div>
                    <div class="homeinfo">
                        <a href= "http://localhost:3000/" ><button type = "button" > Go Home </button></a>
                    </form>
                    </div>
                </body>
            </html>
        `);
});

// Handle user input
app.post('/cellphoneservices.html', async (req, res) => {
    const {firstname, lastname, phonenum, plans, pay, calldate, callduration, creditcard} = req.body;
    const readData = {firstname, lastname, phonenum, plans, pay, calldate, callduration, creditcard};
    // Record transaction time in milliseconds
    const startTime = Date.now();   
    try{
        // Verify the credit card number
        const verifyCard = `
            SELECT balance FROM bank_account WHERE credit_card = $1;
        `;

        const verifyCardResult = await pool.query(verifyCard, [creditcard]);

        // If number does not match table
        if(verifyCardResult.rows.length === 0){
            res.status(400).send("Invalid credit card number. Please enter a valid number.");
            return;
        }
        // Get access to balance
        const accountBalance = verifyCardResult.rows[0].balance;

        const result = await insertCustomer(readData, res, callduration, creditcard);
        const customerId = result.customerId;
        const transactionId = result.transactionId;
        // Calculate cost of call
        const callCost = calculateCallCost(callduration, dataRate, perMB);
        // Update bill amount
        const updateBillAmount = result.BillAmount;
        const dataUsage = result.dataUsage;

        // Print balance to webpage
        let printBalance; 

        // Check if account has enough funds
        if(accountBalance < callCost){
            res.status(400).send("Insufficient funds.");
            return;
        }
        // Subtract bill amount from balance
        const deductAmount = `
            UPDATE bank_account
            SET balance = balance - $1
            WHERE credit_card = $2;
        `;
        const newBalance = await pool.query(deductAmount, [callCost, creditcard]);

        // Update bank_account table
        if(newBalance.rows.length > 0){
            const updatedBalance = newBalance.rows[0].accountBalance;
            const getnewBalance = `
                SELECT balance FROM bank_account WHERE credit_card = $1;
            `;
            const finalBalance = await pool.query(getnewBalance, [creditcard]);
            // Print the new balance 
            if(finalBalance.rows.length > 0){
                printBalance = finalBalance.rows[0].accountBalance;
            }
            else{
                res.status(500).send("Failed to fetch the updated balance from the bank_account table.");
                return;
            }
        }
        const endTime = Date.now();
        // Record elapsed time
        const elapsed = endTime - startTime;
        console.log(`Transaction time: ${elapsed} milliseconds`);
        // Print to webpage
        res.send(`
            <!DOCTYPE html>
            <html lang = "en">
                <head>
                    <meta charset="UTF-8"> 
                    <meta name = "viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" type="text/css" href="style.css">
                    <title>Cell Phone Company </title> 
                    <style>
                        body {
                            padding-top: 5em;
                            display: flex;
                            justify-content: center;
                        }
                        /*Page Gradient*/
                        body.bg-gradient{
                            height: 126vh;
                            width: 100%; /* Add this line to make the gradient fill the entire width */
                            background: linear-gradient(to bottom, #00ccff 0%, #000099 100%);
                        }
                        /*typewriter effect for all headers*/
                        h1{
                            color: #ffffff; /* Set text color to white */
                            font-family: monospace;
                            overflow: hidden;
                            border-right: .15em solid rgb(255, 255, 255);
                            white-space: nowrap;
                            letter-spacing: .15em;
                            animation: typing 2.5s steps(40, end), blink-caret 1.5s step-end infinite;
                            height: 1.2em;
                            text-align: center;
                        }
                        /* The typing effect */
                        @keyframes typing {
                            from { width: 0 }
                            to { width: 100% }
                        }
                        /* The typewriter cursor effect */
                        @keyframes blink-caret {
                            from, to { border-color: transparent }
                            50% { border-color: rgb(255, 255, 255); }
                        }
                        p {
                            text-align: center;
                            color: white;
                            font-family: monospace;
                        }
                        /*CustomerID, first name*/
                        .customerId, .firstname, .lastname, .phonenum, .phoneplan, .payplan{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                        }
                        /* Container for positioning */
                        .content-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                        }
                        /*Button to view transactions and customer info*/
                        .button, .buttoninfo{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                        /*Button for Home Button*/
                        .button2, .homeinfo{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 55%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                        /*Button for Home button*/
                            .homeinfo{
                                top: 75%;
                                left: 54.5%;
                                transform: translate(-50%, -50%);
                        }
                        /*Button for customer info page*/
                        .buttoninfo{
                            top: 75%;
                            left: 44%;
                            transform: translate(-50%, -50%);
                        }
                        .button:hover, .buttoninfo:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        .button:hover, .homeinfo:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        .firstname{
                            position: absolute;
                            top: 27%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .lastname{
                            position: absolute;
                            top: 32%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phonenum{
                            position: absolute;
                            top: 37%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phoneplan{
                            position: absolute;
                            top: 45%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .payplan{
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .viewService{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 75%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .tinyheader{
                            position: absolute;
                            top: 15%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .calldate{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 55%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .callduration{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 61.5%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .creditcard{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 68%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .viewnewCust{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 700%;
                            left: -16%;
                            transform: translate(-50%, -50%);
                        }
                    </style>
                </head>
                <body class="bg-gradient">
                    <!--Typewriter customer info-->
                    <div class="custinfo">
                        <h1>Customer Information</h1> 
                    </div>
                    <br><br>
                    <div class = "tinyheader">
                    <br><br>
                    <br><br>
                    <br><br>
                    <p>Make a transaction</p>
                    </div>
                    <form action = "/cellphoneservices.html" method = "POST">
                    <!--Enter First and Last name-->
                    <div class="firstname">
                        <strong><label for = "firstName"><b>First name:</b></label></strong>
                        <br>
                        <input type="text" name="firstname" id="firstname" maxlength="20" required>
                        <br><br>
                    </div>
                    <div class="lastname">
                        <strong><label for = "lastName"><b>Last name:</b></label></strong>
                        <br>
                        <input type="text" name="lastname" id="lastname" maxlength="20" required>
                        <br><br>
                    </div>
                    <!--Phone number-->
                    <div class="phonenum">
                        <strong><label for = "phoneNum"><b>Phone Number:</b></label></strong>
                        <br>
                        <input type="text" name="phonenum" id="phonenum" maxlength="10" required>
                        <br><br>
                    </div>
                    <!--Choose phone plan-->
                    <div class="phoneplan">
                        <strong><label for = "phonePlan"><b>Select your Phone Plan:</b></label></strong>
                        <br>
                        <select name = "plans" id = "plans">
                            <option value="Post-paid">Post-paid</option>
                            <option value="Pre-paid">Pre-paid</option>
                        </select>
                        <br><br>
                    </div>
                    <!--Choose payment method-->
                    <div class="payplan">
                        <strong><label for = "payPlan"><b>Select your Payment Method:</b></label></strong>
                        <br>
                        <select name = "pay" id = "pay">
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>
                        <br><br>
                    </div>
                    <!--Enter call date-->
                    <div class = "calldate">
                        <strong><label for = "calldate"><b>Enter your Call Date:</b></label></strong>
                        <br>
                        <input type="date" name="calldate" placeholder="DD-MM-YYYY" value="" min="1997-01-01" max="2030-12-31">
                    </div>
                    <!--Enter call duration-->
                    <div class="callduration">
                        <strong><label for="callduration"><b>Enter Call Duration:</b></label></strong>
                        <br>
                        <input type="text" name="callduration" placeholder="HH:MM:SS" value="">
                    </div>
                    <div class="creditcard">
                        <strong><label for="creditcard"><b>Enter Credit Card Number:</b></label></strong>
                        <br>
                        <input type="text" name="creditcard" value="" maxlength="16" required>
                    </div>
                    <div class="buttoninfo">
                        <button type = "submit"> View Transaction </button>
                    </div>
                    <div class ="homeinfo">
                        <a href= "http://localhost:3000/" ><button type = "button" > Go Home </button></a>
                    </form>
                    <div class = "viewnewCust">
                        <h2>Customer Information</h2>
                        <p>Customer ID: ${customerId}</p>
                        <p>Transaction ID: ${transactionId}</p>
                        <p>First Name: ${firstname}</p>
                        <p>Last Name: ${lastname}</p>
                        <p>Phone Plan: ${plans}</p>
                        <p>Payment Method: ${pay}</p>
                        <p>Call Date: ${calldate}</p>
                        <p>Call Duration: ${callduration}</p>
                        <p>Call Cost: $${typeof callCost === 'number' ? callCost.toFixed(2) : 'N/A'}</p>
                        <p>Data Usage: ${typeof dataUsage === 'number' ? dataUsage.toFixed(2): 'N/A'} MB</p>
                        <p>Total Bill Amount: $${updateBillAmount}</p>
                        <p>Transaction time: ${elapsed} milliseconds<p>
                    </div>
                </body>
            </html>
        `);
    }// Error
    catch (err) {
        return res.status(500).send("Error: " + err.message);
    }
});

// Link to all customers' payment method
app.get('/paymentmethod.html', async (req, res) => {
    const selectedMethod = req.query.pay;
    let paymethodHtml = "";
    if(selectedMethod)
    {
        try{
            const result = await pool.query(`
                SELECT 
                    pm.customer_id, 
                    c.first_name,
                    c.last_name, 
                    pm.bill_amount
                FROM
                    Payment_Method pm
                JOIN
                    Customer c ON pm.customer_id = c.customer_id
                WHERE
                    pm.payment_method = $1
                `, [selectedMethod]);
            // Display all customers
            if(result.rows.length > 0){
                paymethodHtml= result.rows.map(row => {
                return `<li>Customer ID: ${row.customer_id}, Name: ${row.first_name} ${row.last_name}, Bill Amount: ${row.bill_amount}</li>`;
                }).join('');
            }
        } 
        // Error
        catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    }
    // All payment methods being displayed on webpage
    res.send(`
        <!DOCTYPE html>
        <html lang = "en">
            <head>
                <meta charset="UTF-8"> 
                <meta name = "viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" type="text/css" href="style.css">
                <title>Cell Phone Company </title> 
                <style>
                    body {
                        padding-top: 5em;
                        display: flex;
                        justify-content: center;
                    }
                    /*Page Gradient*/
                    body.bg-gradient{
                        height: 100vh;
                        width: 100%; /* Add this line to make the gradient fill the entire width */
                        background: linear-gradient(to bottom, #00ccff 0%, #000099 100%);
                    }
                    /*typewriter effect for all headers*/
                    h1{
                        color: #ffffff; /* Set text color to white */
                        font-family: monospace;
                        overflow: hidden;
                        border-right: .15em solid rgb(255, 255, 255);
                        white-space: nowrap;
                        letter-spacing: .15em;
                        animation: typing 2.5s steps(40, end), blink-caret 1.5s step-end infinite;
                        height: 1.2em;
                        text-align: center;
                    }
                    /* The typing effect */
                    @keyframes typing {
                        from { width: 0 }
                        to { width: 100% }
                    }
                    /* The typewriter cursor effect */
                    @keyframes blink-caret {
                        from, to { border-color: transparent }
                        50% { border-color: rgb(255, 255, 255); }
                    }
                    p {
                        text-align: center;
                        color: white;
                        font-family: monospace;
                    }
                    /*Button to view transactions and customer info*/
                    .reportbutton{
                        color: white;
                        background-color: rgb(78, 131, 177);
                        position: absolute;
                        padding: 10px 20px; 
                        top: 40%;
                        left: 44%;
                        transform: translate(-50%, -50%);
                        cursor: pointer;
                        font-family: monospace;
                        text-align: center;
                        text-decoration: none;
                        border: 1px solid white;
                        transition: background-color 0.3s;
                        border-radius: 12px;
                    }
                    /*Button for Home Button*/
                        .button2, .homebutton{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 30%;
                            left: 55%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                    }
                    /*Button for Home button*/
                        .homeinfo{
                            top: 40%;
                            left: 54.5%;
                            transform: translate(-50%, -50%);
                    }
                    /*Button for payment method page*/
                    .reportbutton{
                        top: 30%;
                        left: 45%;
                        transform: translate(-50%, -50%);
                    }
                    .reportbutton:hover{
                        background-color: rgb(66, 112, 153);
                    }
                    .button:hover, .homebutton:hover{
                        background-color: rgb(66, 112, 153);
                    }
                    /*CustomerID, first name*/
                    .customerId, .firstname, .lastname, .phonenum, .phoneplan, .payplan{
                        color: white;
                        font-family: monospace;
                        text-align: center;
                        letter-spacing: .15em;
                    }
                    .payplanreport{
                        color: white;
                        font-family: monospace;
                        text-align: center;
                        letter-spacing: .15em;
                        position: absolute;
                        top: 20%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    /* Container for positioning */
                    .content-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                    }
                    .payplan{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    /*Display info*/
                    .paymentReport{
                        color: white;
                        font-family: monospace;
                        text-align: center;
                        letter-spacing: .15em;
                        position: absolute;
                        top: 300%;
                        left: -22%;
                        width: 800%;
                        transform: translate(-50%, -50%);
                    }
                    h3{
                        color: white;
                        font-family: monospace;
                        text-align: center;
                        letter-spacing: .15em;
                    }
                </style>
            </head>
            <body class="bg-gradient">
            <!--Typewriter view all customer payment methods-->
            <div class="paymethod">
                <h1>Payment Method Reports</h1> 
            </div>
            <br><br>
            <!--Choose payment method-->
            <form action="/paymentmethod.html" method = "GET">
             <div class="payplanreport">
                <strong><label for = "paymethodreport"><b>Select a Payment Method:</b></label></strong>
                <br>
                <select name = "pay" id = "pay">
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                </select>
                <br><br>
            </div>
            <!--Click View report-->
            <div class="reportbutton">
                <button type = "submit"> View Report</button>
            </div>
            <div class ="homebutton">
                <a href= "http://localhost:3000/" ><button type = "button" > Go Home </button></a>
            </form>
            <div class="paymentReport">
                ${paymethodHtml}
            </div>
            </body>
        </html>
    `);
})

// Link to all customers' phone plan
app.get('/phoneplans.html', async(req, res) => {
    const selectedPlan = req.query.plans;
    let planHtml = "";
    if(selectedPlan)
    {
        try{
            const result = await pool.query(`
                SELECT 
                    customer_id, phone_number, first_name, last_name
                 FROM
                    Phone_Plan
                WHERE
                    phone_plan = $1
                `, [selectedPlan]);
            // Display all customers
            if(result.rows.length > 0){
                planHtml= result.rows.map(row => {
                return `<li>Customer ID: ${row.customer_id}, Phone Number: ${row.phone_number}, Name: ${row.first_name} ${row.last_name}</li>`;
                }).join('');
            }
        } 
        // Error
        catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    }
    // All customers' phone plan displayed
    res.send(`
        <!DOCTYPE html>
        <html lang = "en">
            <head>
                <meta charset="UTF-8"> 
                <meta name = "viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" type="text/css" href="style.css">
                <title>Cell Phone Company </title> 
                <style>
                    body {
                        padding-top: 5em;
                        display: flex;
                        justify-content: center;
                    }
                    /*Page Gradient*/
                    body.bg-gradient{
                        height: 100vh;
                        width: 100%; /* Add this line to make the gradient fill the entire width */
                        background: linear-gradient(to bottom, #00ccff 0%, #000099 100%);
                    }
                    /*typewriter effect for all headers*/
                    h1{
                        color: #ffffff; /* Set text color to white */
                        font-family: monospace;
                        overflow: hidden;
                        border-right: .15em solid rgb(255, 255, 255);
                        white-space: nowrap;
                        letter-spacing: .15em;
                        animation: typing 2.5s steps(40, end), blink-caret 1.5s step-end infinite;
                        height: 1.2em;
                        text-align: center;
                    }
                    /* The typing effect */
                    @keyframes typing {
                        from { width: 0 }
                        to { width: 100% }
                    }
                    /* The typewriter cursor effect */
                    @keyframes blink-caret {
                        from, to { border-color: transparent }
                        50% { border-color: rgb(255, 255, 255); }
                    }
                    p {
                        text-align: center;
                        color: white;
                        font-family: monospace;
                    }
                    /*Button to view phone plans w customer info*/
                    .reportbutton{
                        color: white;
                        background-color: rgb(78, 131, 177);
                        position: absolute;
                        padding: 10px 20px; 
                        top: 40%;
                        left: 55%;
                        transform: translate(-50%, -50%);
                        cursor: pointer;
                        font-family: monospace;
                        text-align: center;
                        text-decoration: none;
                        border: 1px solid white;
                        transition: background-color 0.3s;
                        border-radius: 12px;
                    }
                    /*Button for Home Button*/
                    .button2, .homebutton{
                        color: white;
                        background-color: rgb(78, 131, 177);
                        position: absolute;
                        padding: 10px 20px; 
                        top: 30%;
                        left: 55%;
                        transform: translate(-50%, -50%);
                        cursor: pointer;
                        font-family: monospace;
                        text-align: center;
                        text-decoration: none;
                        border: 1px solid white;
                        transition: background-color 0.3s;
                        border-radius: 12px;
                    }
                    /*Button for Home button*/
                        .homeinfo{
                            top: 40%;
                            left: 52%;
                            transform: translate(-50%, -50%);
                    }
                    /*Button for phone plan page*/
                    .reportbutton{
                        top: 30%;
                        left: 45%;
                        transform: translate(-50%, -50%);
                    }
                    .reportbutton:hover{
                        background-color: rgb(66, 112, 153);
                    }
                    .button:hover, .homebutton:hover{
                        background-color: rgb(66, 112, 153);
                    }
                    .phoneplanreport{
                        text-align: center;
                        position: absolute;
                        letter-spacing: .15em;
                        color: white;
                        font-family: monospace;
                        top: 20%;
                        left: 50%;
                        width: 800%;
                        transform: translate(-50%, -50%);
                    }
                    h3{
                        color: white;
                        font-family: monospace;
                        text-align: center;
                        letter-spacing: .15em;
                    }
                    .planReport{
                        text-align: center;
                        position: absolute;
                        letter-spacing: .15em;
                        color: white;
                        font-family: monospace;
                        top: 50%;
                        left: 50%;
                        width: 800%;
                        transform: translate(-50%, -50%);
                    }
                </style>
            </head>
            <body class="bg-gradient">
            <!--Typewriter view all customer phone plans-->
            <div class="phoneplan">
                <h1>Phone Plan Reports</h1> 
            </div>
            <br><br>
            <!--Choose phone plan-->
            <form action="/phoneplans.html" method = "GET">
            <div class="phoneplanreport">
                <strong><label for = "phonePlan"><b>Select a Phone Plan:</b></label></strong>
                <br>
                <select name = "plans" id = "plans">
                    <option value="Post-paid">Post-paid</option>
                    <option value="Pre-paid">Pre-paid</option>
                </select>
                <br><br>
            </div>
            <!--Click View report-->
            <div class="reportbutton">
                <button type = "submit"> View Report</button>
            </div>
            <div class ="homebutton">
                <a href= "http://localhost:3000/" ><button type = "button" > Go Home </button></a>
            </div>
        </form>
            <div class="planReport">
                ${planHtml}
            </div>
            </body>
        </html>
    `);
})

// Link to all customers' data usage
app.get('/datausage.html', async (req, res) => {
    const customerId = req.query.customerId;
    const phoneNumber = req.query.phoneNum;
    let totalPrice = 0;
    let customerName = "";
    let dataUsagehtml = "";
    // If customer id/phhone number is present
    if(customerId || phoneNumber)
    {
        // Get customer data usage
        try{
            // database query joins customer, payment method, phone plan, and data usage tables
            let query = `
              SELECT
                t.t_id,
                t.transaction_date,
                t.customer_id,
                c.first_name AS customer_fn,
                c.last_name AS customer_ln,
                p.payment_method,
                pp.phone_plan,
                du.data_usage,
                du.call_time,
                du.call_date,
                du.call_cost
              FROM
                Transactions t
              JOIN
                Customer c ON t.customer_id = c.customer_id
            LEFT JOIN
                Payment_Method p ON t.customer_id = p.customer_id
            LEFT JOIN
                Phone_Plan pp ON t.customer_id = pp.customer_id
            LEFT JOIN
                Data_Usage du ON t.customer_id = du.customer_id
            `;

            const queryParams = [];
            // Allow user to input either id or number
            if(customerId){
                query += " WHERE t.customer_id = $1";
                queryParams.push(customerId);
            }
            else if(phoneNumber){
                query += " WHERE c.phone_number = $1";
                queryParams.push(phoneNumber);
            }

            const result = await pool.query(query, queryParams);

            if(result.rows.length > 0){
                customerName = `${result.rows[0].customer_fn} ${result.rows[0].customer_ln}`;
                dataUsagehtml = result.rows.map(row => {
                    totalPrice += row.call_cost;
                    const callTime = row.call_time;
                    const timeFormat = callTime ? callTime.toISOString().substr(11, 8) : "N/A";
                    // Print transactions on wepage
                    return `
                     <p>Name: ${customerName}, Transaction Date: ${row.transaction_date}, Data Usage: ${row.data_usage} MB, Call Time: ${timeFormat}, Call Date: ${row.call_date}, Call Cost: $${row.call_cost}</p>`;
                }).join('');
            }
        }
        // Error
        catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    }
    // All cusomers' data usage displayed
    res.send(`
        <!DOCTYPE html>
        <html lang = "en">
            <head>
                <meta charset="UTF-8"> 
                <meta name = "viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" type="text/css" href="style.css">
                <title>Cell Phone Company </title> 
                <style>
                    body {
                        padding-top: 5em;
                        display: flex;
                        justify-content: center;
                    }
                    /*Page Gradient*/
                    body.bg-gradient{
                        height: 100vh;
                        width: 100%; /* Add this line to make the gradient fill the entire width */
                        background: linear-gradient(to bottom, #00ccff 0%, #000099 100%);
                    }
                    /*typewriter effect for all headers*/
                    h1{
                        color: #ffffff; /* Set text color to white */
                        font-family: monospace;
                        overflow: hidden;
                        border-right: .15em solid rgb(255, 255, 255);
                        white-space: nowrap;
                        letter-spacing: .15em;
                        animation: typing 2.5s steps(40, end), blink-caret 1.5s step-end infinite;
                        height: 1.2em;
                        text-align: center;
                    }
                    /* The typing effect */
                    @keyframes typing {
                        from { width: 0 }
                        to { width: 100% }
                    }
                    /* The typewriter cursor effect */
                    @keyframes blink-caret {
                        from, to { border-color: transparent }
                        50% { border-color: rgb(255, 255, 255); }
                    }
                    p {
                        text-align: center;
                        color: white;
                        font-family: monospace;
                    }
                    /*CustomerID, first name*/
                        .customerId, .firstname, .lastname, .phonenum, .phoneplan, .payplan{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                        }
                        /* Container for positioning */
                        .content-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                        }
                        /*Button to view transactions and customer info*/
                        .button, .buttoninfo{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 45%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                        /*Button for Home Button*/
                        .button2, .homebutton{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 54.5%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                                border-radius: 12px;
                        }
                        /*Button for Home button*/
                            .homeinfo{
                                top: 40%;
                                left: 52%;
                                transform: translate(-50%, -50%);
                        }
                        /*Button for customer info page*/
                        .buttoninfo{
                            top: 60%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .button:hover, .buttoninfo:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        .button:hover, .homebutton:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        p{ /*Please enter your CustomerID*/
                            position: absolute;
                            top: 20%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .customerId{ /*User input*/
                            font-family: monospace;
                            position: absolute;
                            top: 30%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .transactions{ /*Transactions*/
                            color: white;
                            position: absolute;
                            font-family: monospace;
                            letter-spacing: .15em;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .data-item{ /*Listed data usage*/
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 250%;
                            width: 1300%;
                            left: -19%;
                            transform: translate(-50%, -50%);
                        }
                        .phonenum{
                            font-family: monospace;
                            position: absolute;
                            top: 35%;
                            left: 50%;      
                            transform: translate(-50%, -50%);
                        }
                        h3{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                        }
                </style>
            </head>
            <body class="bg-gradient">
            <!--Typewriter view all customer data usage-->
            <div class="datause">
                <h1>Data Usage Reports</h1> 
            </div>
            <br><br>
            <p>Please enter your CustomerID.</p>
                    <!--Enter CustomerID-->
                <form action = "/datausage.html" method = "GET">
                    <div class="customerId">
                            <strong><label for = "customerid"><b>CustomerID:</b></label></strong>
                            <br>
                            <input type="text" name="customerId" id="customerid" maxlength="3">
                            <h3>OR</h3>
                            <br><br>
                        </div>
                    <!--Phone number-->
                    <div class="phonenum">
                            <strong><label for = "phoneNum"><b>Phone Number:</b></label></strong>
                            <br>
                            <input type="text" name="phoneNum" id="phonenum" maxlength="10">
                            <br><br>
                        </div>
                    <!--Click button to view report-->
                    <div class="button">
                        <button type = "submit"> View Report</button>
                    </div>
                    <div class ="homebutton">
                    <a href= "http://localhost:3000/" ><button type = "button" > Go Home </button></a>
                </form>
            <div class="data-item">
                ${dataUsagehtml}
            </div>
            <!--Link JS file-->
        <script src="hw2.js"></script>
            </body>
        </html>
    `);
})

// Delete rows from a the phone plan table
app.get('/deleterows.html', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang = "en">
            <head>
                <meta charset="UTF-8"> 
                <meta name = "viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" type="text/css" href="style.css">
                <title>Cell Phone Company </title> 
                <style>
                    body {
                        padding-top: 5em;
                        display: flex;
                        justify-content: center;
                    }
                    /*Page Gradient*/
                    body.bg-gradient{
                        height: 100vh;
                        width: 100%; /* Add this line to make the gradient fill the entire width */
                        background: linear-gradient(to bottom, #00ccff 0%, #000099 100%);
                    }
                    /*typewriter effect for all headers*/
                    h1{
                        color: #ffffff; /* Set text color to white */
                        font-family: monospace;
                        overflow: hidden;
                        border-right: .15em solid rgb(255, 255, 255);
                        white-space: nowrap;
                        letter-spacing: .15em;
                        animation: typing 2.5s steps(40, end), blink-caret 1.5s step-end infinite;
                        height: 1.2em;
                        text-align: center;
                    }
                    /* The typing effect */
                    @keyframes typing {
                        from { width: 0 }
                        to { width: 100% }
                    }
                    /* The typewriter cursor effect */
                    @keyframes blink-caret {
                        from, to { border-color: transparent }
                        50% { border-color: rgb(255, 255, 255); }
                    }
                    p {
                        text-align: center;
                        color: white;
                        font-family: monospace;
                    }
                    /*CustomerID, first name*/
                        .customerId, .firstname, .lastname, .phonenum, .phoneplan, .payplan{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                        }
                        /* Container for positioning */
                        .content-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                        }
                        /*Button to view transactions and customer info*/
                        .button, .buttoninfo{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 43%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                        /*Button for Home Button*/
                        .button2, .homebutton{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 55%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                            /*Button for Home button*/
                            .homeinfo{
                                top: 40%;
                                left: 52%;
                                transform: translate(-50%, -50%);
                        }
                        /*Button for customer info page*/
                        .buttoninfo{
                            top: 60%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .button:hover, .buttoninfo:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        .button:hover, .homebutton:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        p{ /*Please enter your CustomerID*/
                            position: absolute;
                            top: 20%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .customerId{ /*User input*/
                            font-family: monospace;
                            position: absolute;
                            top: 30%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .transactions{ /*Transactions*/
                            color: white;
                            position: absolute;
                            font-family: monospace;
                            letter-spacing: .15em;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .data-item{ /*Listed data usage*/
                            position: absolute;
                            top: 60%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phonenum{
                            font-family: monospace;
                            position: absolute;
                            top: 35%;
                            left: 50%;      
                            transform: translate(-50%, -50%);
                        }
                        h3{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                        }
                        .deletephoneplan{
                            text-align: center;
                            position: absolute;
                            color: white;
                            font-family: monospace;
                            top: 30%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                </style>
            </head>
            <body class="bg-gradient">
            <!--Typewriter view all customer data usage-->
            <div class="datause">
                <h1>Delete Rows</h1> 
            </div>
            <br><br>
            <p>This page will let you delete all the rows from the Phone_Plan table.</p>
            <form action = "/deleterows.html" method = "POST">
                    <div class="deletephoneplan">
                    <strong><label for = "confirm"><b>Are you sure you want to DELETE ALL rows from the Phone_Plan?</b></label></strong>
                    <br>
                    <select name = "confirm" id = "confirm">
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                    </select>
                    <br><br>
                    </div>
                    <!--Click button to delete rows-->
                    <div class="button">
                        <button type = "submit"> DELETE ALL ROWS</button>
                    </div>
                    <div class ="homebutton">
                    <a href= "http://localhost:3000/" ><button type = "button" > Go Home </button></a>
            </form>
            <!--Link JS file-->
        <script src="hw2.js"></script>
            </body>
        </html>
    `);
});

app.post('/deleterows.html', async (req, res) => {
    let message = '';
    const table = 'Phone_Plan';
    // Confirm if user selects YES
    if(req.body.confirm === 'YES'){
        const deleteRows = `DELETE FROM ${table}`;
        pool.query(deleteRows)
            .then(() => {
                console.log(`All rows deleted from ${table}`);
            })
            .catch(error => {
                console.error(`Error deleting rows from ${table}:`, error);
            })
    }
    // Could not delete all rows
    else{
        console.log("Deletion cancelled");
    }
    res.send(`
    <!DOCTYPE html>
        <html lang = "en">
            <head>
                <meta charset="UTF-8"> 
                <meta name = "viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" type="text/css" href="style.css">
                <title>Cell Phone Company </title> 
                <style>
                    body {
                        padding-top: 5em;
                        display: flex;
                        justify-content: center;
                    }
                    /*Page Gradient*/
                    body.bg-gradient{
                        height: 100vh;
                        width: 100%; /* Add this line to make the gradient fill the entire width */
                        background: linear-gradient(to bottom, #00ccff 0%, #000099 100%);
                    }
                    /*typewriter effect for all headers*/
                    h1{
                        color: #ffffff; /* Set text color to white */
                        font-family: monospace;
                        overflow: hidden;
                        border-right: .15em solid rgb(255, 255, 255);
                        white-space: nowrap;
                        letter-spacing: .15em;
                        animation: typing 2.5s steps(40, end), blink-caret 1.5s step-end infinite;
                        height: 1.2em;
                        text-align: center;
                    }
                    /* The typing effect */
                    @keyframes typing {
                        from { width: 0 }
                        to { width: 100% }
                    }
                    /* The typewriter cursor effect */
                    @keyframes blink-caret {
                        from, to { border-color: transparent }
                        50% { border-color: rgb(255, 255, 255); }
                    }
                    p {
                        text-align: center;
                        color: white;
                        font-family: monospace;
                    }
                    /*CustomerID, first name*/
                        .customerId, .firstname, .lastname, .phonenum, .phoneplan, .payplan{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                        }
                        /* Container for positioning */
                        .content-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                        }
                        /*Button to view transactions and customer info*/
                        .button, .buttoninfo{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 43%;;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                        /*Button for Home Button*/
                        .button2, .homebutton{
                            color: white;
                            background-color: rgb(78, 131, 177);
                            position: absolute;
                            padding: 10px 20px; 
                            top: 40%;
                            left: 55%;
                            transform: translate(-50%, -50%);
                            cursor: pointer;
                            font-family: monospace;
                            text-align: center;
                            text-decoration: none;
                            border: 1px solid white;
                            transition: background-color 0.3s;
                            border-radius: 12px;
                        }
                            /*Button for Home button*/
                            .homeinfo{
                                top: 40%;
                                left: 52%;
                                transform: translate(-50%, -50%);
                        }
                        /*Button for customer info page*/
                        .buttoninfo{
                            top: 60%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .button:hover, .buttoninfo:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        .button:hover, .homebutton:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        p{ /*Please enter your CustomerID*/
                            position: absolute;
                            top: 20%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .customerId{ /*User input*/
                            font-family: monospace;
                            position: absolute;
                            top: 30%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .transactions{ /*Transactions*/
                            color: white;
                            position: absolute;
                            font-family: monospace;
                            letter-spacing: .15em;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .data-item{ /*Listed data usage*/
                            position: absolute;
                            top: 60%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phonenum{
                            font-family: monospace;
                            position: absolute;
                            top: 35%;
                            left: 50%;      
                            transform: translate(-50%, -50%);
                        }
                        h3{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                        }
                        .deletephoneplan{
                            text-align: center;
                            position: absolute;
                            color: white;
                            font-family: monospace;
                            top: 30%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                </style>
            </head>
            <body class="bg-gradient">
            <!--Typewriter view all customer data usage-->
            <div class="datause">
                <h1>Delete Rows</h1> 
            </div>
            <br><br>
            <p>This page will let you delete all the rows from the Phone_Plan table.</p>
                <form action = "/deleterows.html" method = "POST">
                    <div class="deletephoneplan">
                    <strong><label for = "confirm"><b>Are you sure you want to DELETE ALL rows from the Phone_Plan?</b></label></strong>
                    <br>
                    <select name = "confirm" id = "confirm">
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                    </select>
                    <br><br>
                    </div>
                    <!--Click button to delete rows-->
                    <div class="button">
                        <button type = "submit" id="deleteButton"> DELETE ALL ROWS</button>
                    </div>
                    <div class ="homebutton">
                    <a href= "http://localhost:3000/" ><button type = "button" > Go Home </button></a>
                </form>
            <div class="data-item">
               ${message}
            </div>
            <!--Link JS file-->
        <script src="hw2.js"></script>
            </body>
        </html>
    `);
})

// Get README File
app.get('/hw2.README', async(req, res) => {
    res.send(`
        <h1># HW2: Cell Phone Company</h1>
        <p>
        This application allows the user to create a new customer to add to the cell phone company database. 
        The user is able to view transactions and search for a transaction as well. 
        The user can also delete all the rows from a table.
        </p>
        <h2>Installation</h2>
        <p>Packages:</p>
        <p>npm install express</p>
        <p>npm install pg</p>
        <p>npm install body-parser</p>
        <p>Once downloaded, the packages should be loaded into the 'node_modules' directory.</p>
        <h3>Usage</h3>
        <p>When running locally, user must have package.json, package-lock.json, and cred.json in the same directory as the hw2.js file.</p>
        <p>To run the web application: node hw2.js</p>
        <p>Traverse to "http://localhost:3000/" on a browser to access the website.</p>
        <h3>Homepage</h3>
        <p>The homepage of the web application allows the user to navigate through different links that perform certain tasks. 
        On the homepage, it asks the user to enter a Customer ID or a phone number. 
        A transaction must be present in the database in order to view one. 
        To make a transation, the first link "Buy Services" allows you to make one.
        </p>
        <h3>Buy Services</h3>
        <p>The Buy Services link allows the user to make a transaction. First, enter a name and phone number.
        It will then allow the user to select the type of phone plan and payment method to commit to.
        The user enters their recent call date and the duration of their call. The form will request to input a valid credit card number.
        Valid credit card numbers are inserted into the SQL under the Bank_Account table. Simply enter any credit card number from the table.
        When the button is clicked, the user is able to see their information as well as the calculated cost of the call, their total bill amount,
        and the amount of MB used in their call.
        </p>
        <h3>Payment Methods</h3>
        <p>The Payment Methods link allows the user to select between the two types of payment methods: Automatic and Manual.
        With the drop down, the user simply selects a payment method to view and clicks the "View Report" button. 
        The Payment Method Report lists all the customers that have selected that payment when making a transaction. 
        </p>
        <h3>Phone Plans</h3>
        <p>The Phone Plans link allows the user to select between the two types of phone plans: Pre-paid and Post-paid.
        With the drop down, the user simply selects a phone plan to view and clicks the "View Report" button. 
        The Phone Plan Report lists all the customers that have selected that payment when making a transaction.

        Disclaimer: If "Delete all rows" link has been executed, the user will not see any report for phone plans.
        To see a report, the user must make a new transaction and come back to this link.
        </p>
        <h3>Data Usage</h3>
        <p>The Data Usage link allows the user to enter a valid Customer ID and phone number. When the button is clicked,
        a report for how much data was used for their call is listed in MB, with their corresponding call duration and call cost.
        </p>
        <h3>Delete all rows</h3>
        <p>The Delete all rows link allows the user to delete all the rows that were stored in the Phone_Plan table. 
        A confirmation message is asked to the user. If the user selects no, it will be displayed in the console. 
        To confirm that the rows truly are deleted after selecting YES, the user can go back to the Phone Plans link and select a plan. 
        The report will not be displayed once the rows are deleted. 
        </p>
    `);
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
