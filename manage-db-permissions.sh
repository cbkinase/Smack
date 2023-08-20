#!/bin/sh

# Check if `instance` exists
if [ ! -d /app/instance/ ]; then
    # Create the folder if it doesn't exist
    mkdir -p /app/instance
fi

# Check and set the ownership for instance directory
if [ "$(stat -c %U /app/instance)" != "appuser" ]; then
    chown -R appuser:appuser /app/instance
fi
