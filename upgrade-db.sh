rm instance/dev.db
flask db upgrade && flask seed all
