#!/bin/bash
source_file=".env.example"
destination_file=".env"
be_directory=".venv"
fe_directory="react-app/node_modules"
db_file="instance/dev.db"
db_folder="instance"

# Create .env if it doesn't exist

if [ ! -f "$destination_file" ]; then
    # Copy the contents of .env.example into .env
    cat "$source_file" > "$destination_file"

else
    echo "File $destination_file already exists"
fi


# Check if .venv exists: install backend dependencies & db if not

if [ ! -d "$be_directory" ]; then
    echo "Installing backend dependencies. This may take a few minutes."
    pipenv install -r requirements.txt
else
    echo "Starting up Smack!!!"
fi

# Handle creation of SQLite database

if [[ ! -f "$db_file" ]]; then
    if [[ -d "$db_folder" && -z "$(ls -A "$db_folder")" ]]; then
        echo "Removing empty instance directory"
        rm -rf "$db_folder"
    fi
    echo "Creating/seeding DB..."
    pipenv run flask db upgrade && pipenv run flask seed all
fi


# Check for frontend dependencies

if [[ ! -d "$fe_directory" || -z "$(ls -A "$fe_directory")" ]]; then
    if [ -d "$fe_directory" ]; then
        echo "Removing empty node modules"
        rm -rf node_modules
    fi
    echo "Installing frontend dependencies. This may take some time."
    cd react-app
    npm install
    cd ..
else
    echo "Directory exists: $fe_directory"
fi

cd react-app
node ./set-localhost-proxy.js


# Spawn processes in a subshell and trap SIGINT to kill 0
# (See https://stackoverflow.com/a/52033580 for more)

(trap 'kill 0' SIGINT; npm start & cd .. && pipenv run flask run & wait)
