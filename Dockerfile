# Use a slim version of Python 3 as the base image
FROM python:3.9-slim

# Install system dependencies required by LightGBM (libgomp1)

# Set the working directory in the container
WORKDIR /2

# Copy requirements.txt
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

# Copy the entire project directory into the container
COPY . .

# Expose port 5005 for the Flask application
EXPOSE 5002

# Define the command to run the application
CMD ["python", "D:\LMOPS\2\app\main.py"]