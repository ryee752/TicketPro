USE ticket_pro;

CREATE TABLE Passwords (
	password_ID VARCHAR(50),
    hashed_password VARCHAR(60) NOT NULL,
    password_salt VARCHAR(50),
    creation_date DATETIME,
    last_update_date DATETIME,
    PRIMARY KEY (password_ID)
);

CREATE TABLE User (
    user_ID VARCHAR(50),
    password_ID VARCHAR(50),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(50) UNIQUE NOT NULL, 
    PRIMARY KEY(user_ID),
    FOREIGN KEY (password_ID) REFERENCES Passwords(password_ID) ON DELETE CASCADE ON UPDATE CASCADE,
	INDEX details (first_name, last_name, phone, email),
    INDEX mail (email)
);

CREATE TABLE Organization (
	org_ID VARCHAR(50),
    password_ID VARCHAR(50),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    street VARCHAR (255),
    city VARCHAR(255),
    state CHAR(2),
    zipcode INT,
    PRIMARY KEY (org_ID),
    FOREIGN KEY (password_ID) REFERENCES Passwords(password_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX mail (email)
);

-- Event table
CREATE TABLE Event (
    event_id VARCHAR(50),
    org_id VARCHAR(50),
    title VARCHAR(50),
    start_time DATETIME,
    end_time DATETIME,
    date DATE,
    capacity INT,
    waitlist_capacity INT DEFAULT 0,
    price DECIMAL(10,2),
    availability ENUM('available', 'unavailable') DEFAULT 'available',
    street VARCHAR(255),
    city VARCHAR(255),
    state CHAR(2),
    zipcode INT,
    type ENUM('Concert', 'Webinar', 'Conference', 'Workshop') NOT NULL,
    image LONGBLOB,
    description TEXT,
    PRIMARY KEY (event_id),
    FOREIGN KEY (org_id) REFERENCES Organization(org_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Concert specialization table
CREATE TABLE Concert (
    event_id VARCHAR(50),
    genre VARCHAR(50),
    PRIMARY KEY (event_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Webinar specialization table
CREATE TABLE Webinar (
    event_id VARCHAR(50),
    event_link VARCHAR(255),
    access_code VARCHAR(50),
    PRIMARY KEY (event_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Conference specialization table
CREATE TABLE Conference (
    event_id VARCHAR(50),
    speaker_name VARCHAR(255),
    PRIMARY KEY (event_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Workshop specialization table
CREATE TABLE Workshop (
    event_id VARCHAR(50),
    instructor_name VARCHAR(255),
    topic VARCHAR(255),
    PRIMARY KEY (event_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Ticket (
    ticket_id VARCHAR(50),
    user_id VARCHAR(50),
    event_id VARCHAR(50),
    expiration_date DATETIME,
    seat_num INT,
    price DECIMAL(10,2),
    PRIMARY KEY (ticket_id),
    KEY (seat_num),
    FOREIGN KEY (user_id) REFERENCES User(user_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Payment_Method (
    method_id VARCHAR(50),
    user_id VARCHAR(50),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    street VARCHAR(255), -- BILLING ADDRESS
    city VARCHAR(255),
    state CHAR(2),
    zipcode INT,
    card_number VARCHAR(60),
    card_salt VARCHAR(60), 
    last_four CHAR(4),
    card_type VARCHAR(10),
    expiry_date CHAR(5), -- MM/YY format
    cvv VARCHAR(4),
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
