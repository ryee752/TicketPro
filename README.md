# TicketPro

Our web-based application is an event management and ticketing platform that allows event organizers to create, promote, and manage events, while providing attendees with a streamlined experience for discovering, purchasing tickets, and attending events. It can cater to a wide range of events such as concerts, webinars, conferences, workshops, and community gatherings. 


## Requirements
Install NPM and Node.js (Installation: [Link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))<br />
Node.js v20.18.0<br />
NPM 10.8.2<br />
### MySQl
Install MySQL Workbench (Installation [Link](https://dev.mysql.com/downloads/workbench/))<br />
1. Create an account for the root user
2. Create a database by running the CREATE DATABASE ticket_pro command
4. Execute the tm_createdb.sql file

### .env File
1. Create an .env file and include the following environmental variables (Replace password with the password used for the root user in the previous steps)<br />
DB_HOST=localhost<br />
DB_USER=root<br />
DB_PASSWORD=password<br />
DB_NAME=ticket_pro<br />
2. Add the .env file to the nextjs-dashboard directory

### Set seed data1
1. Execute the insert.sql
2. line 207-209 in the app/page.tsx, uncomment
   ```bash
     // useEffect(() => {
     //   imageForEvents();
     // }, []);
   ```

## Installation

1. Switch to ./nextjs-dashboard folder (Using cd command) after cloning Repository

2. Install pnpm
```bash
   npm install -g pnpm
   ```

3. Install dependencies using pnpm:
```bash
   pnpm i
   ```

## Starting the application
1. Start the development server with the following command:
```bash
   pnpm dev
   ```

2. Open http://localhost:3000 on your browser


### Set seed data2
1. Execute the insert.sql
2. line 207-209 in the app/page.tsx, comment again
   ```bash
      useEffect(() => {
        imageForEvents();
      }, []);
   ```
## Contributions
Ryan Yee
- Implemented frontend login and sign-up features for Users and Organizations
- Connected the frontend and backend to sign in and register Users and Organizations
- Created a secure sign-up and login process by salting and storing hashed the password
- Made sure that Users and Organizations can't sign up with already registered emails.
- Setting up the project layout and environment
- Refined Schema for Users and Organizations
Nathan Duong: 
- Implemented front end for payment form.
- Implemented connecting frontend payments to the backend.
- Helped implement the buying tickets button compared with queried data. 
- Auto-incrementation of seat numbers. 
- Tested edge cases and debugged payment and ticket-related transactions.
- Frontend components related to payment and ticket tables properly updating tables through queries.
- Refined and edited schema for payment methods and tickets. 
Keigo Tajima
- Implemented frontend and backend for the Homepage/dashboard
- Implemented side tab that is used for page navigation
- Came up with the design for the Schema
- Normalized the the database design.
- Frontend framework design and decisions
- Implemented popular events and registered events display homepage
- Implemented upcoming and in-progress events display on the homepage
Kisang Hwang
- Changed Event table and type specialization
- Front-end Event list page / read event list query
- Implemented filters for the event list using dynamic querying
- Front-end Create/Edit event page
- Implemented create/edit/delete/type specialization query
- Front-end Event detail page
- Dealing with and setting up global variables for login sessions
- Created seed data
- Implemented putting image binary data to the Event table
May Sabai
- Designed the frontend for Users and Organizations profile pages
- Connected the backend to frontend for Users and Organizations profile pages
- Collaborated on schema
