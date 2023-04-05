# Slack clone: User Stories

## User

### Signup
* A user not already in the database should be able to see a signup form.
    * /signup page: valid data
        * Form asking for username, email, password, first name, last name
        * login the user upon successful submission of signup form

    * /signup page: invalid data
        * Form validations show show at the /signup page for invalid fields

### Log In
* A user whose information is in the database should have access to a Log In Page
    * /login page: valid data
        * Email and password entry fields on a form
        * Upon valid entries and clicking the Log In button, user is logged in and redirected to the home page where they can see their channels and DMs on sidebar

    * /login page: invalid data
        * Form should show invalid entries so that the user knows which fields are invalid

### Log Out
* A logged in user should be able to see an interactive Log Out button on the navigation bar
    * While on any page of the site:
        * The logged in user should be able to log out from a drop down menu of their user profile

### Demo User
* A user not logged in and not in the database should see a clear button on both the /signup and /login pages to visit the site as a guest without signing up or logging in.
    * /signup or /login:
        * User can click on a Demo User button to log in and allow access privileges


# Slack

### View Channel
* A logged in user should be able to see all channels they belong in
    * /:user_token/:channel_id
        * side-bar shows a list of all channels the user belongs in
        * side-bar should show channels and DMs with clear categorization of either

### Create Channel
* A logged in user should be able to create new channels by clicking on the [+] Add channels button on the sidebar
    * /:user_token/*
        * Upon clicking "[+] Add channels" button, the user should see a popup form with name and description (optional) fields
        * the "Create" button is disabled when the field validations fail
        * the popup form should have a "Create" button that directs the user to a new popup form when clicked
        * upon channel creation, the user sees a popup form that has a textfield to add users to the channel
        * after going through the aforementioned forms, the user is redirected to the channel upon successful creation

### Edit Channel
* A logged in user should be able to click the channel name on the top of the channel page which opens up a popup that shows the channel details
    * /:user_token/:channel_id | user is NOT owner
        * A user who is NOT the owner of the channel may edit the description of the channel and add members to the channel
        * the user should see the name of the channel as a header in the popup
        * the user should see and be able to interact with two tabs: About, Members {number of members}
        * in the About tab, the user is able to see details of the channel in the popup, such as the channel description, channel creation details, a button to leave the channel, and the channel ID
        * in the Members {number of members } tab, the user is able to see a list of all the users in the channel as well as an "Add people" button
        * upon clicking the "Add people" button, a popup form appears with a text field that takes in an email
    * /:user_token/:channel_id | user is owner
        * A user who is the owner of the channel may edit the channel name, edit the description, and add members to the channel
        * the user should see the name of the channel as a header in the popup
        * the user should see and be able to interact with two tabs: About, Members {number of members}
        * in the About tab, the user is able to see details of the channel in the popup, such as the channel description, channel creation details, a button to leave the channel, and the channel ID
        * in the Members {number of members } tab, the user is able to see a list of all the users in the channel as well as an "Add people" button
        * upon clicking the "Add people" button, a popup form appears with a text field that takes in an email
        

### Delete Channel

### View Messages
* A logged in user should be able to see all messages of their selected channel
    * /:channel_id
        * all messages belonging to a channel should be visible
        * each message should contain the message owner's avatar, first name, last name, time posted, and message content

### Create Message
* A logged in user should be able to create a new message by typing a message into an input field (or WYSIWYG editor) located in a section below the channel/direct message pane.
    * /:user_token/:channel_id
    * Upon creation, the newly created message will appear within the bottom portion of the channel/direct message pane.
    * If the message is a direct message, a new channel will automatically be created with the both the 
    sender and recipient added as channel members.  The channel name will be generated from the names of the members.
    
### Edit Message
* A logged in and authorized user should be able to edit messages.
* When hovering over a message, a menu should instantiate with options to edit.
    * /:channel_id
        * Only the owner of the message should be have permission to edit.

### Delete Message
* A logged in and authorized user should be able to delete messages.
* When hovering over a message, a menu should instantiate with options to delete.
    * /:channel_id
        * Only the owner of the message should be have permission to delete.
        
## Half CRUDS

### Create Reaction
* A logged in user should be able to react to any messages belonging to a channel that the user is a part of.
* When hovering over a message, a menu should instantiate with options to add a reaction.
    * /:channel_id
        * User can choose from list of designated emotions.

### Delete Reaction
* A logged in user should be able to delete / remove a reaction.
* User's own reaction to a message should be clearly indicated. 
    * /:channel_id
        * Reclicking the reaction should remove the corresponding reaction.

### Edit User Info
* A logged in and authorized user should be able to edit appropriate user info.
* When clicking the button with user icon, a section should instantiate on the right side of the screen, displaying basic information about the user.
    * The section must contain user's name, email, and an edit button.
    * Upon pressing the edit button, the modal should pop up allowing user to modify their own information.
        * The modal should be populated with appropriate data of the user.
        * When untouched, the value for the field should be preserved through the edit.

### Delete User
* A logged in and authorized user should be able to delete own user account.
* When clicking the button with user icon, a section should instantiate on the right side of the screen, displaying basic information about the user.
    * There should be a button, allowing user to delete their own account after a confirmation.
