FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# RUN npx prisma generate esto en typeorm tendras que buscarlo bryan por maje por querer hacerlo en typeorm
# "docker:start": "prisma migrate dev && prisma generate"

COPY . .

EXPOSE 4000