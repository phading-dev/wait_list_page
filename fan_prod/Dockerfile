FROM node:20.12.1

WORKDIR /app
COPY bin/ .
RUN npm ci --omit=dev

EXPOSE 80
CMD ["node", "main_bin", "."]
