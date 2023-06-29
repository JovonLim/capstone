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
        `Budget.js` Handles the add/update of budget and the calculation of the remaining budget.
      - `App.js`: Main component and entry point for the application, sets up routing paths using React Router.
      - `index.js`: Renders the App component into the index.html root element.
      - `styles.css`: Contains all the CSS used in the frontend.
    - `public` Directory: Static assets and main HTML file

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