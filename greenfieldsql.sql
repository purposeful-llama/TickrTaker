-- DROP DATABASE tickr;

-- CREATE DATABASE tickr;

DROP TABLE bids;
DROP TABLE items;
DROP TABLE users;

CREATE TABLE users (
	userId SERIAL PRIMARY KEY,
	username VARCHAR(20) NOT NULL UNIQUE,
	password VARCHAR(20) NOT NULL,
	address VARCHAR (45),
	phone_number BIGINT,
	email VARCHAR (45)
);

CREATE TABLE items (
	itemId SERIAL PRIMARY KEY,
	userId INTEGER REFERENCES users(userId), -- seller user id
	title TEXT NOT NULL,
	description TEXT,
	picture TEXT,
	startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	endDate TIMESTAMP NOT NULL,
	startPrice MONEY NOT NULL,
	endPrice MONEY NOT NULL
);

CREATE TABLE bids (
	bidId SERIAL PRIMARY KEY,
	userId INTEGER REFERENCES users(userId),
	itemId INTEGER REFERENCES items(itemId),
	price MONEY NOT NULL
);

INSERT INTO users (username, password, address, phone_number, email) VALUES ('Kunal', 'password', '6106 Countess Dr.', 4083916950, 'littlefe2000@gmail.com');
INSERT INTO users (username, password, address, phone_number, email) VALUES ('Kartik', 'newpassword', '944 Market St.', 4084640817, 'kartikra@gmail.com');
INSERT INTO users (username, password, address, phone_number, email) VALUES ('Lex', 'anotherpassword', '101 Main St.', 4085335581, 'lex@gmail.com');
INSERT INTO users (username, password, address, phone_number, email) VALUES ('Leonard', 'extrapassword', '344 6th St.', 6508689933, 'leonard@gmail.com');
INSERT INTO users (username, password, address, phone_number, email) VALUES ('Cihan', 'easypassword', '2002 Homestead Dr.', 4087777458, 'cihan@gmail.com');

INSERT INTO items (userId, title, description, picture, endDate, startPrice, endPrice) VALUES (1, 'this is a thing', 'i dont know what to write', 'www.imgr.com/2308afe.gif', CURRENT_TIMESTAMP, 1000, 600);
INSERT INTO items (userId, title, description, picture, endDate, startPrice, endPrice) VALUES (2, 'this is another thing', 'i dont know what', 'www.imgr.com/fffkdes1.gif', CURRENT_TIMESTAMP, 2000, 300);
INSERT INTO items (userId, title, description, picture, endDate, startPrice, endPrice) VALUES (3, 'this is a special thing', 'still cant write', 'www.imgr.com/uglypic.gif', CURRENT_TIMESTAMP, 8000, 5000);
INSERT INTO items (userId, title, description, picture, endDate, startPrice, endPrice) VALUES (1, 'this is a super thing', 'a cool description', 'www.imgr.com/coolpic.gif', CURRENT_TIMESTAMP, 10, 1);

INSERT INTO bids (userId, itemID, price) VALUES (1, 2, 800);
INSERT INTO bids (userId, itemID, price) VALUES (2, 1, 900);
INSERT INTO bids (userId, itemID, price) VALUES (3, 1, 850);
INSERT INTO bids (userId, itemID, price) VALUES (4, 1, 950);
INSERT INTO bids (userId, itemID, price) VALUES (1, 3, 5000);
INSERT INTO bids (userId, itemID, price) VALUES (2, 4, 10);
