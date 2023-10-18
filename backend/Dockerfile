# Use Python 3.10.12 as a parent image
FROM python:3.10.12

# Set environment variables for Python to run in unbuffered mode
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create and set the working directory in the container
WORKDIR /app

# Expose the port that Django will run on
EXPOSE 8000

# Install Django and any other dependencies you may need
RUN pip install Django

# Create a new Django project
RUN django-admin startproject myproject .

# Specify the command to run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
