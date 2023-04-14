<h1 style="text-align: center;"> Welcome to Smack!</h1>

<p align="center">
   ![smacklogo](https://user-images.githubusercontent.com/63670745/232160890-e8312f62-b8a2-47c3-9be1-c45e0c73f34e.png)
</p>

<p align="center">
Smack is a project developed to emulate <a href="https://slack.com">Slack</a>, built with flask backend and react frontend.
Smack was created from collboration between:
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

## Getting started

1. Clone this repository.

2. Install dependencies in both app and react-app directories.

   -  In the app directory, run
      ```
      pipenv shell
      pipenv install
      ```

   - In the react-app directory, run
      ```
      npm install
      ```
   
3. Create a **.env** file based on the example with proper settings for your development environment. Basic **.env** file should include:

   - SECRET_KEY
   - DATABASE_URL (default: sqlite:///dev.db)
   - SCHEMA (default: flask_schema)

<br />

4. Get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

5. To run the React App in development, 

   ```bash
   npm start
   ```
