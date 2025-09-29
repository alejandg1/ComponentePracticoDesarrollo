FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
ENV NODE_OPTIONS="--openssl-legacy-provider"
CMD ["npm", "run", "dev"]