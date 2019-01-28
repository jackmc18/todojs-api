-- Deploy fresh database tables
\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'
\i '/docker-entrypoint-initdb.d/tables/boards.sql'
\i '/docker-entrypoint-initdb.d/tables/lists.sql'
\i '/docker-entrypoint-initdb.d/tables/cards.sql'

\i '/docker-entrypoint-initdb.d/seed/seed.sql'