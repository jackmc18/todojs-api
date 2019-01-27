BEGIN TRANSACTION;

INSERT into users (name, email, joined) values ('john', 'john@gmail.com', '2018-01-01');
INSERT into login (hash, email) values ('$2a$10$0umiOSkXu//nmGjZxQZr9OEix8a89OjRRLA/PCFZJbOpN/juGpkAu', 'john@gmail.com');

COMMIT;