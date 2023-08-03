# Welcome to Smack!


Smack is a project developed to emulate <a href="https://slack.com">Slack</a>, built with a Flask backend and React frontend.
   
Smack was a collaborative effort, with the following creators:

- Cameron Beck <a target="_blank" href="https://github.com/cbkinase">(GitHub)</a>
- Cynthia Liang <a href="https://github.com/cynthialiang00">(GitHub)</a>
- Dave Titus <a href="https://github.com/dtitus929">(GitHub)</a>
- Brian Hitchin <a href="https://github.com/brianhitchin">(GitHub)</a>

Please reference the <a href="https://github.com/brianhitchin/wack/wiki">Wiki</a> for full documentation, schema, store shape, and other information. 

## How to Run Locally

You have two easy options for running Smack locally.

If you already have `Node 16` and `pyenv 3.9.4`:

1. Clone this repository.
2. Run `bash start.sh` in the root directory of the project.
3. Your SQLite database will automatically persist in instance/dev.db.

Otherwise, you can use Docker:

1. Clone this repository.
2. Run `docker compose up` in the root directory of the project.
3. Your SQLite database will automatically persist on a Docker volume.


In either case, your frontend will be available at `localhost:3000` and your backend at `localhost:5000`.

Please note that the attachment feature will not work locally until you provide AWS S3 credentials. To do so, you must specify the following environment variables:
- `S3_BUCKET` - the name of your S3 bucket
- `S3_KEY` - your access key ID
- `S3_SECRET` - your secret access key
