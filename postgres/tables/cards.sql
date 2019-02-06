BEGIN TRANSACTION;

CREATE TABLE cards (
    card_id serial PRIMARY key,
    list_id int NOT NULL,
    card_content VARCHAR(1024),
    card_position int NOT NULL,
    created TIMESTAMP NOT NULL,
    FOREIGN KEY (list_id) REFERENCES lists(list_id) ON DELETE CASCADE
);

COMMIT;