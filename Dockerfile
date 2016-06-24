FROM node:6.2.1-slim

# Install dependencies
RUN apt-get update \
  && apt-get install -qy git build-essential \
  && rm -rf /var/lib/apt/lists/*

# Setup User
RUN useradd -g daemon -m -d /app app

# cd /app
WORKDIR /app

# Setup port for container/app
EXPOSE 22
ENV PORT 22
RUN setcap cap_net_bind_service=+ep /usr/local/bin/node

# Ensure node modules are layer-cached until dependency files change
ADD npm-shrinkwrap.json /tmp/npm-shrinkwrap.json
ADD package.json /tmp/package.json
RUN cd /tmp && \
    npm install --no-optional

# Copy app but replace node_modules with layer-cached version
ADD . /app
RUN rm -rf node_modules .tmp keys && \
    mv /tmp/node_modules /app/

# Drop privileges
USER app

# Generate default keys for test/eval
RUN bash generate-key.sh

# Allow host keys to be overridden by volume
VOLUME /app/keys

# Default command to run on boot
CMD ["start"]
ENTRYPOINT ["npm"]
