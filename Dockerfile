# --- Stage 1: Build React ---
    FROM node:18 AS frontend
    WORKDIR /app/frontend 
    COPY frontend/ .
    RUN npm install && npm run build
      # Creates /app/frontend/dist/
    
    # --- Stage 2: Build Spring Boot ---
    FROM maven:3.9.6-eclipse-temurin-17 AS backend
    WORKDIR /app
    COPY . .
    COPY --from=frontend /app/frontend/dist src/main/resources/static/
    RUN mvn clean package -DskipTests
    
    FROM eclipse-temurin:17-jdk-jammy
    WORKDIR /app
    COPY --from=backend /app/target/*.jar app.jar
    COPY --from=backend /app/src/main/resources/static /static
    EXPOSE 8080
    ENTRYPOINT ["java", "-jar", "app.jar"]