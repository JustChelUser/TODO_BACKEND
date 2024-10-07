FROM node:22

WORKDIR /usr/src/app

COPY package*.json tsconfig*.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

EXPOSE 7000

# Assign `npm run start:prod` as the default command to run when booting the container
CMD ["npm", "run", "start:prod"]