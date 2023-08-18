# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Create a new user 'appuser'
RUN useradd -m appuser

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

RUN bash ./manage-db-permissions.sh


# Switch back to 'appuser' for running the application
USER appuser

# Make port 5000 available to the world outside this container
EXPOSE 5000

COPY --chown=appuser:appuser init.sh /app/init.sh

# Create DB if not present & run the app when the container launches.
CMD ["bash", "./init.sh"]
