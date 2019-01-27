BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY key,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    joined TIMESTAMP NOT NULL
);

COMMIT;