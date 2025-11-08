# 1. Começa com uma imagem base do Java 17
FROM eclipse-temurin:17-jdk-jammy

# 2. Cria uma pasta "app" dentro do container
WORKDIR /app

# 3. Copia os arquivos do Maven (o "mapa" do build)
COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .

# 4. (Otimização) Baixa as dependências PRIMEIRO
# (Isso cria um cache, para builds futuros serem mais rápidos)
RUN ./mvnw dependency:go-offline

# 5. Copia o código-fonte (o "src")
COPY src ./src

# 6. Roda o "Build Command" (compila o Java)
# (O Render não vai mais fazer isso, o Docker vai)
RUN ./mvnw clean install -DskipTests

# 7. Roda o "Start Command" (inicia o app)
# (O Render também não vai fazer isso, o Docker vai)
CMD ["java", "-jar", "target/Comanda-Digital-0.0.1-SNAPSHOT.jar"]