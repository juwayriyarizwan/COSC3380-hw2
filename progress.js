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
                        .transaction-item{ /*Listed transactions*/
                            position: absolute;
                            top: 60%;
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
                            <input type="text" name="customerId" id="customerid" maxlength="2">
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
                        <span><a href="deleteTransaction.html" style="color: white;">Refund Services</a></span>
                    </div>
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
async function insertCustomer(readData, res, callduration){
    console.log("inserting...");
    const userInput = await pool.connect();
    try{
        await userInput.query('BEGIN');
        // Calculate cost of call
        const callCost = calculateCallCost(callduration);
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
        const customerId = result.rows[0].customer_id;
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
            dataUsage,
        ];
        await userInput.query(insertUsage, usageData);
        // Add the cost onto the total amount
        const updateBill = `
            UPDATE Payment_Method
            SET bill_amount = bill_amount + $1
            WHERE customer_id = $2;
        `;
        const BillAmount = [
            callCost, 
            customerId
        ];
        await userInput.query(updateBill, BillAmount);
        // Update the customer table again
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
        return {customerId, transactionId, BillAmount};
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
                            top: 70%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .button:hover, .buttoninfo:hover{
                            background-color: rgb(66, 112, 153);
                        }
                        .firstname{
                            position: absolute;
                            top: 20%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .lastname{
                            position: absolute;
                            top: 25%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phonenum{
                            position: absolute;
                            top: 30%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phoneplan{
                            position: absolute;
                            top: 40%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .payplan{
                            position: absolute;
                            top: 45%;
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
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .callduration{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 55%;
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
                    <div class="buttoninfo">
                        <button type = "submit">
                            View transaction
                        </button>
                    </form>
                    </div>
                </body>
            </html>
        `);
});

// Handle user input
app.post('/cellphoneservices.html', async (req, res) => {
    const {firstname, lastname, phonenum, plans, pay, calldate, callduration} = req.body;
    const readData = {firstname, lastname, phonenum, plans, pay, calldate, callduration};
    try{
        const result = await insertCustomer(readData, res, callduration);
        const customerId = result.customerId;
        const transactionId = result.transactionId;
        // Calculate cost of call
        const callCost = calculateCallCost(callduration);
        // Update bill amount
        const updateBillAmount = result.BillAmount;
        const dataUsage = result.dataUsage;
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
                        .firstname{
                            position: absolute;
                            top: 20%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .lastname{
                            position: absolute;
                            top: 25%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phonenum{
                            position: absolute;
                            top: 30%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .phoneplan{
                            position: absolute;
                            top: 40%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .payplan{
                            position: absolute;
                            top: 45%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .viewnewCust{
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
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .callduration{
                            color: white;
                            font-family: monospace;
                            text-align: center;
                            letter-spacing: .15em;
                            position: absolute;
                            top: 55%;
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
                    <div class="buttoninfo">
                        <button type = "submit">
                            View transaction
                        </button>
                    </div>
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
                        <p>Call Cost: $${callCost.toFixed(2)}</p>
                        <p>Data Usage:${dataUsage} MB</p>
                        <p>Total Bill Amount: $${updateBillAmount}</p>
                    </div>
                </body>
            </html>
        `);
    }// Error
    catch (err) {
        return res.status(500).send("Error: " + err.message);
    }
});

// Link to delete a transaction
app.get('/deleteTransaction.html', async (req, res) => {
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
                    .phonenum{
                        font-family: monospace;
                        position: absolute;
                        top: 35%;
                        left: 50%;      
                        transform: translate(-50%, -50%);
                    }
                </style>
            </head>
            <body class="bg-gradient">
                <div class="intro">
                    <h1>Refund Services</h1> 
                </div>
                <br><br>
                <p>Please enter your CustomerID.</p>
                <!--Enter CustomerID-->
            <div class="customerId">
                    <strong><label for = "customerid"><b>CustomerID:</b></label></strong>
                    <br>
                    <input type="text" name="customerId" id="customerid" maxlength="2">
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
                <!--Click Delete Transactions-->
                <div class="button">
                    <button type = "submit"> Delete Transaction</button>
                </div>
                <!--Confirmation button-->
                <div id = "confirmation" style="display: none;">
                    <p> Are you sure you want to delete this transaction?</p>
                    <button id ="confirmYes">YES</button>
                    <button id ="confirmNo">NO</button>
                </div>
                <!--Handle interaction-->
                <!--Link JS file-->
                <script src="hw2.js">
                <!--Handle interaction-->
                document.getElementById("deleteTransactionButton").addEventListener("click", () => {
                    
                    document.getElementById("confirmationModal").style.display = "block";
                  });
                  document.getElementById("cancelDeleteButton").addEventListener("click", () => {
                    document.getElementById("confirmationModal").style.display = "none";
                  });
              
                  document.getElementById("confirmDeleteButton").addEventListener("click", async () => {
                    const customerId = 123; 
                    try {
                        const response = await fetch('http://localhost:3000/deleteTransaction/' + customerId, {
                            method: 'POST',
                          });
              
                      if (response.ok) {
                        const data = await response.json();
                        document.getElementById("deletedInformation").innerHTML = JSON.stringify(data.deletedData);
                        document.getElementById("deletedInformation").style.display = "block";
                        document.getElementById("confirmationModal").style.display = "none";
                      } else {
                        console.error("Deletion failed");
                      }
                    } catch (error) {
                      console.error("AJAX request failed: " + error.message);
                    }
                  });
                </script>
            </body>
        </html>
    `);
})

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
                    /*Button for payment method page*/
                    .reportbutton{
                        top: 30%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    .reportbutton:hover{
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
                        top: 50%;
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
                    /*Button for phone plan page*/
                    .reportbutton{
                        top: 30%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    .reportbutton:hover{
                        background-color: rgb(66, 112, 153);
                    }
                    .phoneplanreport{
                        text-align: center;
                        position: absolute;
                        color: white;
                        font-family: monospace;
                        top: 20%;
                        left: 50%;
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
                        color: white;
                        font-family: monospace;
                        top: 40%;
                        left: 50%;
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
                            <input type="text" name="customerId" id="customerid" maxlength="2">
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});