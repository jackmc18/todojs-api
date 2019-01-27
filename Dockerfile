FROM node:lts-jessie

WORKDIR /usr/src/todojs-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]