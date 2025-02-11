# Prima etapă: construirea aplicației
FROM maven:3.8.3-openjdk-17 AS builder

# Copierea codului sursă și a fișierelor necesare
COPY ./src/ /root/src
COPY ./pom.xml /root/
COPY ./src/main/resources/sensor.csv /root/src/main/resources/
WORKDIR /root

# Construirea aplicației
RUN mvn package
RUN java -Djarmode=layertools -jar /root/target/Device_Simulator-0.0.1-SNAPSHOT.jar list
RUN java -Djarmode=layertools -jar /root/target/Device_Simulator-0.0.1-SNAPSHOT.jar extract
RUN ls -l /root

# A doua etapă: crearea imaginii finale
FROM openjdk:17-jdk-slim-buster

# Copierea layerelor din build
COPY --from=builder /root/dependencies/ ./
COPY --from=builder /root/snapshot-dependencies/ ./

# Pauză pentru a asigura inițializarea containerului
RUN sleep 10

# Copierea layerelor specifice aplicației
COPY --from=builder /root/spring-boot-loader/ ./
COPY --from=builder /root/application/ ./

# Copierea fișierului sensor.csv pentru a fi disponibil în containerul final
COPY --from=builder /root/src/main/resources/sensor.csv /src/main/resources/sensor.csv

# Definirea punctului de intrare
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher", "-XX:+UseContainerSupport", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseCGroupMemoryLimitForHeap", "-XX:MaxRAMFraction=1", "-Xms512m", "-Xmx512m", "-XX:+UseG1GC", "-XX:+UseSerialGC", "-Xss512k", "-XX:MaxRAM=72m"]
