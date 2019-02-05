BEGIN TRANSACTION;

INSERT into users (name, email, joined) values ('john', 'john@gmail.com', '2018-01-01');
INSERT into login (hash, email) values ('$2a$10$0umiOSkXu//nmGjZxQZr9OEix8a89OjRRLA/PCFZJbOpN/juGpkAu', 'john@gmail.com');

INSERT into boards (owner_id, board_name, created) values ('1', 'Example', '2018-01-01');
INSERT into lists (board_id, list_name, created) values ('1', 'Todo', '2018-01-01');
INSERT into lists (board_id, list_name, created) values ('1', 'Doing', '2018-01-01');
INSERT into lists (board_id, list_name, created) values ('1', 'Done', '2018-01-01');
INSERT into cards (list_id, card_content, card_position, created) values ('1', 'Example card', '0', '2018-01-01');

COMMIT;