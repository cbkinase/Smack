<h1 style="text-align: center;"> Welcome to Smack!</h1>

<p align="center">
   <img src="https://user-images.githubusercontent.com/63670745/232160890-e8312f62-b8a2-47c3-9be1-c45e0c73f34e.png" alt="Welcome!")
</p>

<p align="center">
Smack is a project developed to emulate <a href="https://slack.com">Slack</a>, built with Flask backend and React frontend.
Smack was created from collaboration between:
</p>

<p align="center">
Cameron Beck <a href="https://github.com/cbkinase">Github</a>
</p>

<p align="center">
Cynthia Liang <a href="https://github.com/cynthialiang00">Github</a>
</p>

<p align="center">
Dave Titus <a href="https://github.com/dtitus929">Github</a>
</p>

<p align="center">
Brian Hitchin <a href="https://github.com/brianhitchin">Github</a>
</p>

<p align="center">
Please reference the <a href="https://github.com/brianhitchin/wack/wiki">Wiki</a> for full documentation, schema, store shape, and other information. 
</p>

## How to Run Locally

You have two easy options for running Smack locally.

If you already have `Node 16` and `pyenv 3.9.4`:

1. Clone this repository.
2. Run `start.sh` in the root directory of the project.
3. Your SQLite database will automatically persist in instance/dev.db.

Otherwise, you can use Docker:

1. Clone this repository.
2. Run `docker compose up` in the root directory of the project.
3. Your SQLite database will automatically persist on a Docker volume.
