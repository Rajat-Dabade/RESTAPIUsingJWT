FROM arm64v8/node:16-alpine

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . /home/app

COPY package*.json /home/app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
