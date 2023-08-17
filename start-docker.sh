source_file=".env.example"
destination_file=".env"

# Create .env if it doesn't exist

if [ ! -f "$destination_file" ]; then
    # Copy the contents of .env.example into .env
    cat "$source_file" > "$destination_file"

else
    echo "File $destination_file already exists"
fi

docker compose up
