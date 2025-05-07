# Stage 1: Build React frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install && npm run build

# Stage 2: Build Spring Boot backend
FROM maven:3.9.6-eclipse-temurin-17 AS backend
WORKDIR /app
COPY . .
COPY --from=frontend /app/frontend/dist src/main/resources/static/
RUN mvn clean package -DskipTests

# Stage 3: Run the final app
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar

# Let Spring Boot bind to 0.0.0.0:PORT
ENV PORT=8080

EXPOSE 8080

# Reliable healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5 \

  CMD curl --fail http://localhost:8080/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
