# Use an official Python runtime as a parent image

# Using alpine to minimize image size, though note
# that in production, since we use psycopg2, we'll
# have to either use a different image (slim-buster)
# or install deps for psycopg2
# (https://stackoverflow.com/questions/42424108/installing-psycopg2-in-an-alpine-docker-container)
FROM python:3.9-alpine

# Set the working directory in the container
WORKDIR /app

# Create a new user 'appuser'
RUN adduser -D appuser

# Switch to 'appuser'
USER appuser

# Copy the requirements file needed for pip install
COPY requirements.txt ./

# Switch back to root to install dependencies
USER root

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
# and change ownership to appuser
COPY --chown=appuser:appuser . /app

# Ensure that the database is owned by appuser as well
RUN sh ./manage-db-permissions.sh

# Switch back to 'appuser' for running the application
USER appuser

# Make port 5000 available to the world outside this container
EXPOSE 5000

COPY --chown=appuser:appuser init.sh /app/init.sh

# Create DB if not present & run the app when the container launches.
CMD ["sh", "./init.sh"]
