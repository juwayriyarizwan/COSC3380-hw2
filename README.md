# HW2: Cell Phone Company
    This application allows the user to create a new customer to add to the cell phone company database. 
    The user is able to view transactions and search for a transaction as well. 
    The user can also delete all the rows from a table.

## Installation
    Packages:
    `npm install express`
    `npm install pg``
    `npm install body-parser`
    Once downloaded, the packages should be loaded into the 'node_modules' directory.

## Usage
    When running locally, user must have package.json, package-lock.json, and cred.json in the same directory as the hw2.js file.
    To run the web application: node hw2.js
    Traverse to "http://localhost:3000/" on a browser to access the website.

## Homepage
    The homepage of the web application allows the user to navigate through different links that perform certain tasks. On the homepage, it asks the user to enter a Customer ID or a phone number. A transaction must be present in the database in order to view one. To make a transation, the first link "Buy Services" allows you to make one.

## Buy Services
    The Buy Services link allows the user to make a transaction. First, enter a name and phone number. It will then allow the user to select the type of phone plan and payment method to commit to. The user enters their recent call date and the duration of their call. The form will request to input a valid credit card number. Valid credit card numbers are inserted into the SQL under the Bank_Account table. Simply enter any credit card number from the table. When the button is clicked, the user is able to see their information as well as the calculated cost of the call, their total bill amount, and the amount of MB used in their call.

## Payment Methods 
    The Payment Methods link allows the user to select between the two types of payment methods: Automatic and Manual. With the drop down, the user simply selects a payment method to view and clicks the "View Report" button. The Payment Method Report lists all the customers that have selected that payment when making a transaction. 

## Phone Plans
    The Phone Plans link allows the user to select between the two types of phone plans: Pre-paid and Post-paid. With the drop down, the user simply selects a phone plan to view and clicks the "View Report" button. The Phone Plan Report lists all the customers that have selected that payment when making a transaction.

    Disclaimer: If "Delete all rows" link has been executed, the user will not see any report for phone plans.
    To see a report, the user must make a new transaction and come back to this link.

## Data Usage
    The Data Usage link allows the user to enter a valid Customer ID and phone number. When the button is clicked, a report for how much data was used for their call is listed in MB, with their corresponding call duration and call cost.

## Delete all rows
    The Delete all rows link allows the user to delete all the rows that were stored in the Phone_Plan table. A confirmation message is asked to the user. If the user selects no, it will be displayed in the console. To confirm that the rows truly are deleted after selecting YES, the user can go back to the Phone Plans link and select a plan. 
    The report will not be displayed once the rows are deleted. 
