source_file=".env.example"
destination_file=".env"
be_directory=".venv"
fe_directory="react-app/node_modules"
env_contents="SECRET_KEY=lkasjdf09ajsdkfljalsiorj12n3490re9485309irefvn,u90818734902139489230
DATABASE_URL=sqlite:///dev.db
SCHEMA=smack_schema"

# Create .env if it doesn't exist

if [ ! -f "$destination_file" ]; then
    # Copy the contents of .env.example into .env
    echo "$env_contents" > "$destination_file"

else
    echo "File $destination_file already exists"
fi


# Check if .venv exists: install backend dependencies & db if not

if [ ! -d "$be_directory" ]; then
    echo "Installing backend dependencies and creating/seeding database. This may take a few minutes."
    pipenv install -r requirements.txt && pipenv run flask db upgrade && pipenv run flask seed all
else
    echo "Starting up Seddit!!!"
fi


# Check if the directory exists

if [ ! -d "$fe_directory" ]; then
    echo "Directory does not exist: $fe_directory"
    echo "Installing frontend dependencies. This may take some time."
    cd react-app
    npm install
else
    echo "Directory exists: $fe_directory"
fi

cd react-app

# Spawn processes in a subshell and trap SIGINT to kill 0
# (See https://stackoverflow.com/a/52033580 for more)

(trap 'kill 0' SIGINT; npm start & cd .. && pipenv run flask run & wait)
