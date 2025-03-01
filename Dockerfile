# Use the official Node.js image from the Docker Hub
FROM node:22

# Set the working directory
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Prismaクライアントを生成
COPY prisma ./prisma
RUN npx prisma generate

# TypeScriptをコンパイル
RUN yarn build

# コンテナ起動時にPrismaマイグレーションを実行
RUN npx prisma migrate deploy

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "dev"]