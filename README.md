<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Instalations
- Para creacion de microservicios: ```npm i --save @nestjs/microservices```
- Para validacion de data en request: ```npm i --save class-validator class-transformer```
- Para variales de entorno y validacion: ```npm i dotenv joi```
- Para base de datos: ```npm install --save @nestjs/typeorm typeorm pg```
- Instalar nats para comunicacion mediante mensajeria postal: ```npm i --save nats```


# Steps to run this application
- Clone or download this project
- Install all dependencies ```npm install```
- Create __.env__ file and set the variables in this file with the __.env.template__ file
- Test the sqlite db connection
- Start app but first start nats: ```docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats``` and then ```npm run start:dev```