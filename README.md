# Transaction Tracker 

## Description 
The Transaction Tracker is a web application that allows users to effortlessly manage their finances by adding transactions and filtering through them for easy searching. 
The Tracker also provides users with a personalized profile page where they can set monthly budgets, track their current account balance, and gain valuable insights
into their transaction habits over the past months.

The Tracker was designed using ReactJS for the frontend, with Django REST API for the backend.

## Distinctiveness and Complexity



## Source Files 
- `capstone` Directory: Core Django Application 
  - `init.py`: Empty file that serves as an indicator to Python that the directory is a Python package. 
  - `asgi.py`: ASGI config.
  - `settings.py`: Contains the settings for the core django application.
  - `urls.py`: Handles all the urls of the web application.
  - `wsgi.py`: WSGI config.

- `frontend` Directory: Frontend application created using react-create-app
    - `src` Directory: Source Code for the react application 
      - `components` Directory: Source Code for components that are part of the differnet pages
        - `Budget.js`: Handles the add/update of monthly budget and the calculation of the remaining budget.
        - `FilterOptions.js`: Handles the filter form and setting filters for the transactions.
        - `LogoutBtn.js`: Handles the logout button on the navbar and clears the localStorage items.
        - `Navbar.js`: Handles the navigation bar on the top, setting navigation paths for the React Router.
        - `Statistics.js`: Handles the generation of statistics in the Profile page.
        - `UserForm.js`: Handles the user form for register/login.
      - `pages` Directory: Source Code for pages that render when a user clicks the link on the navbar.
        - `Home.js`: If a user is not logged in, displays a welcome message and ask the user to register, else displays a message to
          tell user to visit the transactions and profile page.
        - `Login.js`: Displays the user form that is used to authenticate the user in the web application.
        - `NotFound.js`: Displays a 404 Error if the user tried to enter an invalid path in the address bar.
        - `Profile.js`: Displays the profile page of the user, with statistics and budget setting.
        - `Register.js`: Displays the user form that is used to register a user into the database.
        - `Transactions.js`: Displays the various transactions the user has tracked, with options to add/filter transactions.
      - `App.js`: Main component and entry point for the application, sets up routing paths using React Router.
      - `index.js`: Renders the App component into the index.html root element.
      - `styles.css`: Contains all the CSS used in the frontend.
      - `package.json`: Contains project metadata and a list of dependencies.
      - `package-lock.json`: Contains detailed dependency tree information.
    - `public` Directory: Static assets and main HTML file
      - `index.html`: The main HTML file to be rendered.
      - `manifest.json`: Provide metadata about application.

## How to run 
Prerequisites: Python and NodeJS have to be installed in your system.

1. Navigate to the project directory by running the command `cd capstone/` 
  in the folder where you placed the downloaded folder.

2. Run the command `pip install -r requirements.txt` to install the neccessary python dependencies
   to run the web application.

3. Navigate to the frontend directory by running the command `cd frontend/`.

4. Run the command `npm install` to install the necessary node modules to run the web application.

5. Run the command `npm run build` to build the files needed to render the web application.

6. Return to the outer directory and run the command `py manage.py transaction makemigrations`, then `py manage.py migrate`
  to create the database needed for the web application.

7. To run the application, run the command `py manage.py runserver`.

Note: Make sure to use the appropriate Python command (pip, pip3, python3, py etc.) based on your system's configuration.