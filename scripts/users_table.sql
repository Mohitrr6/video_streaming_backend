CREATE TABLE users (
	user_id VARCHAR(100) PRIMARY KEY,
	user_name VARCHAR(20),
	user_email VARCHAR(50) UNIQUE,
	user_pass VARCHAR(100),
	created_at DATE
)