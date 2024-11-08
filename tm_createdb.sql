CREATE TABLE Passwords (
	password_ID VARCHAR(20),
    hashed_password VARCHAR(50) NOT NULL,
    password_salt VARCHAR(50),
    creation_date DATETIME,
    last_update_date DATETIME,
    PRIMARY KEY (password_ID)
);

CREATE TABLE User (
    user_ID VARCHAR(20),
    password_ID VARCHAR(20),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(50) UNIQUE NOT NULL, 
    role VARCHAR(50),
    PRIMARY KEY(user_ID),
    FOREIGN KEY (password_ID) REFERENCES Passwords(password_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Organization (
	org_ID VARCHAR(20),
    password_ID VARCHAR(20),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    street VARCHAR (255),
    city VARCHAR(255),
    state CHAR(2),
    zipcode INT,
    PRIMARY KEY (org_ID),
    FOREIGN KEY (password_ID) REFERENCES Passwords(password_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Event (
	event_id VARCHAR(20),
    start_time DATETIME,
    end_time DATETIME,
    date DATE,
    capacity INT,
    waitlist_capacity INT,
    price DECIMAL(10,2),
    street VARCHAR (255),
    city VARCHAR(255),
    state CHAR(2),
    zipcode INT,
    PRIMARY KEY (event_id)
);
CREATE TABLE Ticket (
	ticket_id VARCHAR(20),
	user_id VARCHAR(20),
    event_id VARCHAR(20),
    expiration_date DATETIME,
    seat_num VARCHAR(10),
    price DECIMAL(10,2),
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Payment_Method (
	method_id VARCHAR(20),
    user_id VARCHAR(20),
    street VARCHAR (255), -- BILLING ADDRESS
    city VARCHAR(255),
    state CHAR(2),
    zipcode INT,
    card_number INT,
    PRIMARY KEY (method_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Waitlist (
	user_id VARCHAR(20),
    event_id VARCHAR(20),
    queue_position INT, 
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE List_Of_Subscribed_Events (
	user_id VARCHAR(20),
    event_id VARCHAR(20),
    subscription_date DATETIME,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Attendance_History (
	user_id VARCHAR(20),
    event_id VARCHAR(20),
    attendance_date DATETIME,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);