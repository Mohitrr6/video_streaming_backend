CREATE TABLE videoData (
    video_id VARCHAR(100) PRIMARY KEY,
    video_name VARCHAR(100) NOT NULL,
    video_desc TEXT NOT NULL,
	status VARCHAR(20) NOT NULL,
	visiblity VARCHAR(10) NOT NULL,
	likes NUMERIC(10,0),
    user_id VARCHAR(100) NOT NULL,
    uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_video_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);