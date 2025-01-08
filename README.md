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

## Starting the application in developer mode
1. Start the development server with the following command:
```bash
   pnpm dev
   ```
2. Open http://localhost:3000 on your browser


## Building Running the application
1. Build the application with the following command:
```bash
   pnpm build
   ```
2. Running the application with the following command:
```bash
   pnpm start
   ```


### Set seed data2
1. Execute the insert.sql
2. line 207-209 in the app/page.tsx, comment again
   ```bash
      useEffect(() => {
        imageForEvents();
      }, []);
   ```
## Key Features
- User Management: Secure user login and sign-up process, including email validation and password hashing.
- Event Management: Ability to create, edit, and delete events, with dynamic querying and filters for event lists.
- Payment Integration: Frontend payment form and backend integration for ticket purchasing, including auto-incrementation of seat numbers.
- Homepage and Dashboard: Displays popular, registered, upcoming, and in-progress events, with side navigation for seamless navigation.
- Profile Pages: Displays user information, such as their registered events.
