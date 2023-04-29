FROM node:18.16.0-slim

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.11.0/wait /wait
RUN chmod +x /wait

EXPOSE 3001

CMD /wait && npm start