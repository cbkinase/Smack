
# Welcome to Smack!
Smack is a project developed to emulate <a target="_blank" rel="noreferrer" href="https://slack.com">Slack</a>.

Smack was a collaborative effort, with the following creators:

- Cameron Beck <a target="_blank" rel="noreferrer" href="https://github.com/cbkinase">(GitHub)</a>
- Cynthia Liang <a target="_blank" rel="noreferrer" href="https://github.com/cynthialiang00">(GitHub)</a>
- Dave Titus <a target="_blank" rel="noreferrer" href="https://github.com/dtitus929">(GitHub)</a>
- Brian Hitchin <a target="_blank" rel="noreferrer" href="https://github.com/brianhitchin">(GitHub)</a>

## About the Project

Smack is powered by...

<div>
<img class="logo" src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white">
<img class="logo" src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">
<img class="logo" src="https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white">
<img class="logo" src="https://img.shields.io/badge/gunicorn-%298729.svg?style=for-the-badge&logo=gunicorn&logoColor=white">
<img class="logo" src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white">
</div>

<div>
<img class="logo" src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
<img class="logo" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
<img class="logo" src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white">
<img class="logo" src="https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white">
<img class="logo" src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101">
</div>


## Features

Currently, we support the following features:
- Secure login/signup
    - OAuth2 integration for quick third-party logins with trusted providers
- Profile customization
- Channels
    - Create public channels and invite users
    - Explore public channels and join ones that suit your interests
    - Start direct messages, joinable only by invitation
    - Direct messages can involve multiple users
- Real-time chat
    - Send and download attachments
    - React to users' messages
    - Edit and delete your own messages... for those times you messed up
    - Know when someone is responding to you with typing indicators
- Online/offline statuses for users

## How to Run Locally

Use Docker to run the application locally:

1. Clone this repository
2. Run `bash start-docker.sh` in the root directory of the project
3. Your SQLite database will automatically persist on a Docker volume
4. Your nginx server will be available at `localhost:8080`, acting as a reverse proxy to route requests to the web application's services

### Caveats to Running Locally

Please note that the attachment feature will not work locally until you provide AWS S3 credentials. To do so, you must specify the following environment variables:

- `S3_BUCKET` - the name of your S3 bucket
- `S3_KEY` - your access key ID
- `S3_SECRET` - your secret access key


In addition, you must specify the following environment variables to enable the sending of account activation emails:

- `MAIL_USERNAME` - the email address to send from
- `MAIL_PASSWORD` - the password to your mailbox
- `SMACK_ADMIN` - the email address to send from
- `MAIL_SERVER` - the SMTP server you choose


To enable OAuth2 integration, you must also specify the following for each authentication provider:
- Google:
    - `GOOGLE_CLIENT_ID` - your Google OAuth 2.0 Client ID
    - `GOOGLE_CLIENT_SECRET` - your Google OAuth 2.0 Client secret

- ... more providers coming in the future!
