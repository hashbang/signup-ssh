FROM node:6.2.1-slim

# Install dependencies
RUN apt-get update \
  && apt-get install -qy git build-essential \
  && rm -rf /var/lib/apt/lists/*

USER app
WORKDIR /app

EXPOSE 4444

# Ensure node modules are layer-cached until dependency files change
ADD npm-shrinkwrap.json /tmp/npm-shrinkwrap.json
ADD package.json /tmp/package.json
RUN cd /tmp && \
    npm update -g && \
    npm install --no-optional

# Copy app but replace node_modules with layer-cached version
ADD . /app
RUN rm -rf /app/{node_modules,dist,.tmp} && \
    mv /tmp/node_modules /app/

CMD ["start"]
ENTRYPOINT ["npm"]
