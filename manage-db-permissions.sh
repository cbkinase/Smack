#!/bin/bash
# Check and set the ownership for instance directory
if [ "$(stat -c %U /app/instance)" != "appuser" ]; then
    if [ ! -d /app/instance/ ]; then
        # Create the folder if it doesn't exist
        mkdir -p /app/instance
    fi
    chown -R appuser:appuser /app/instance
fi
