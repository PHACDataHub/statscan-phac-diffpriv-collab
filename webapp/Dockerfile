FROM node:19-bullseye

WORKDIR /dp-react-app

COPY package.json /dp-react-app/

COPY dist /dp-react-app/dist/

COPY server.js /dp-react-app/

RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]

