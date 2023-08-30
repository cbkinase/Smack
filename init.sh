#!/bin/sh

# Check and set the ownership for instance directory
if [ "$(stat -c %U /app/instance)" != "appuser" ]; then
    chown -R appuser:appuser /app/instance
fi

# Check if DB exists
if [ ! -f /app/instance/dev.db ]; then
    flask db upgrade
    flask seed all
fi

# Start Flask application
exec gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 -b 0.0.0.0:5000 app:app
