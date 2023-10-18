# Use an official Python runtime as a parent image
FROM python:3.10.12

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install requests

# Make port 80 available to the world outside this container
# If your script runs a web server, you can expose a specific port
# EXPOSE 80

# Define the command to run your script
CMD [ "python", "api.py" ]
