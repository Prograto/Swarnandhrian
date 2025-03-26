FROM python:3.9-slim

#working directory
WORKDIR /app


COPY . /app



# Installing Node.js (LTS version) and npm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Installing g++
RUN apt-get update && \
    apt-get install -y g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Installing Java
RUN apt-get update && \
    apt-get install -y default-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# app runs on
EXPOSE 5000

ENV FLASK_APP=app.py

# Running the Flask application
CMD ["flask", "run", "--host=0.0.0.0"]
