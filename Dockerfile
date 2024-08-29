# Use an existing image as a base
FROM node:16

# Establecer la variable de entorno a no interactivo
ENV DEBIAN_FRONTEND=noninteractive
COPY zip_3.0-11+b1_amd64.deb /tmp/
# Actualizar la lista de paquetes e instalar p7zip
RUN dpkg -i /tmp/zip_3.0-11+b1_amd64.deb

ENV AWS_CLI /usr/local/aws-cli/v2/2.15.34
ENV PATH $PATH:$AWS_CLI/bin

# Install Serverless
RUN npm config set strict-ssl false && \
    npm install -g serverless@3 && \
    export PATH=$PATH:/usr/local/bin/serverless
