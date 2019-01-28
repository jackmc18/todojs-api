BEGIN TRANSACTION;

CREATE TABLE lists (
    list_id serial PRIMARY key,
    board_id int NOT NULL,
    list_name VARCHAR(256),
    created TIMESTAMP NOT NULL,
    FOREIGN KEY (board_id) REFERENCES boards(board_id)
);

COMMIT;