FROM node:18

WORKDIR /app

# Copy package.json trước để cache install
COPY package*.json ./

RUN npm install

# Copy toàn bộ source
COPY . .

# Expose port (tuỳ từng service)
EXPOSE 3000

CMD ["npm", "run", "dev"]
