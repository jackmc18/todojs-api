BEGIN TRANSACTION;

CREATE TABLE boards (
    board_id serial PRIMARY key,
    owner_id int NOT NULL,
    board_name VARCHAR(256),
    created TIMESTAMP NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMIT;