# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Limit memory to stay within Render's free tier (512MB) and use the assigned PORT
CMD java -Xmx384m -Xss512k -Dserver.port=${PORT} -jar app.jar
