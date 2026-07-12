# ===== Этап 1: сборка =====
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Сначала копируем только файлы, нужные для скачивания зависимостей
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Только теперь копируем исходный код и компилируем
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# ===== Этап 2: финальный образ =====
FROM eclipse-temurin:25-jre
WORKDIR /app

# Создаём непривилегированного пользователя внутри контейнера
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]