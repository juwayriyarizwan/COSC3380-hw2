const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const creds = require('./creds.json');
const pool = new Pool(creds);

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
                    // Print transactions on wepage
                    return `
                     <p>Transaction ID: ${row.t_id},  Date: ${row.transaction_date}, Data Usage: ${row.data_usage} MB, Call Time: ${row.call_time}, Call Cost: $${row.call_cost}</p>`;
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
                        <a href="phoneplans.html" style="color: white;">Phone Plans</a>
                        <a href="datausage.html" style="color: white;">Data Usage</a>
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

// Line for new/old customers to make a transaction
app.get('/cellphoneservices.html', (req, res) => {
    const customerId = req.query.customerId;
    const phoneNumber = req.query.phoneNum;

    if(customerId && phoneNumber)
    {
        try{

        }
        // Error
        catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    }
    // View customer sign up
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
                        top: 50%;
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
                        <option value="Post-Paid">Post-Paid</option>
                        <option value="Pre-Paid">Pre-Paid</option>
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
                <div class="buttoninfo">
                    <a href="transactions.html" class="button">
                        View transaction
                    </a>
                </div>
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
                    customer_id, first_name, last_name, bill_amount
                FROM
                    Payment_Method
                WHERE
                    payment_method = $1
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
app.get('/phoneplans.html', (req, res) => {
    const customerId = req.query.customerId;
    const phoneNumber = req.query.phoneNum;

    if(customerId || phoneNumber)
    {
        try{

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
                    h3{
                        color: white;
                        font-family: monospace;
                        text-align: center;
                        letter-spacing: .15em;
                    }
                </style>
            </head>
            <body class="bg-gradient">
            <!--Typewriter view all customer phone plans-->
            <div class="phoneplan">
                <h1>Phone Plan Reports</h1> 
            </div>
            <br><br>
            </body>
        </html>
    `);
})

// Link to all customers' data usage
app.get('/datausage.html', (req, res) => {
    const customerId = req.query.customerId;
    const phoneNumber = req.query.phoneNum;

    if(customerId || phoneNumber)
    {
        try{

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
            </body>
        </html>
    `);
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
