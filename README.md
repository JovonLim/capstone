# Transaction Tracker 

## Description 
The Transaction Tracker is a web application that allows users to effortlessly manage their finances by adding transactions and filtering through them for easy searching. 
The Tracker also provides users with a personalized profile page where they can set monthly budgets, track their current account balance, and gain valuable insights
into their transaction habits over the past months.

The Tracker was designed using ReactJS for the frontend, with Django REST API for the backend.

## Distinctiveness and Complexity
For distinctiveness, I believe my project is completely different from the previous projects since it 
is user-centric, which is not comparable to a social network, e-commerce site nor email client where
users have to interact with one another. Instead, its purpose is for users to keep track and manage their finances 
better via a user-friendly and responsive UI.

Furthermore, while most of the previous projects have basic CRUD features, they merely display the data as they are.
In my Transaction Tracker, transactions dynamically adjusts the amount of the user's remaining budget and current account balance, 
which provides real-time feedback and can influence their future spending habits. The transactions' data are also used to plot pie charts and 
line graphs to provide better visual representation of the users' transaction habits.

For complexity, the Transaction Tracker takes into account most of the topics that I have learnt throughout the course,
such as user authentication, models, rendering, animations, user-responsive pages etc. All of the previous projects also utilized Django to provide 
both the frontend templates and the backend API. For this project, I decided to learn ReactJS in order to separate the backend and frontend completely. 
I also decided to learn the Django REST framework to provide the API for React to consume. This exposed me to many different classes and libraries, such as 
viewsets, serializers, axios, chartJS etc. Learning how to integrate them together was the hardest and most complex part of the project for me since it was 
very different from the other projects. Instead of rendering it from templates in Django with a context dictionary, I had to fetch the data when the page loads, 
render them properly using JSX syntax and make them responsive as well. I also had to learn how to utilize Bootstrap effectively for most of the HTML 
to achieve mobile responsiveness.

## Source Files 
- `capstone` directory: Core Django Application 
  - `init.py`: Empty file that serves as an indicator to Python that the directory is a Python package. 
  - `asgi.py`: ASGI config.
  - `settings.py`: Contains the settings for the core django application.
  - `urls.py`: Handles all the urls of the web application.
  - `wsgi.py`: WSGI config.

- `frontend` directory: Frontend application created using react-create-app
    - `src` directory: Source Code for the react application 
      - `components` directory: Source Code for components that are part of the different pages
        - `Budget.js`: Handles the add/update of monthly budget and the calculation of the remaining budget.
        - `FilterOptions.js`: Handles the filter form and setting filters for the transactions.
        - `LogoutBtn.js`: Handles the logout button on the navbar and clears the localStorage items.
        - `Navbar.js`: Handles the navigation bar on the top, setting navigation paths for the React Router.
        - `Statistics.js`: Handles the generation of statistics in the Profile page.
        - `UserForm.js`: Handles the user form for register/login.
      - `pages` directory: Source Code for pages that render when a user clicks the link on the navbar.
        - `Home.js`: If a user is not logged in, displays a welcome message and ask the user to register, else displays a message to
            tell user to visit the transactions and profile page.
        - `Login.js`: Displays the user form that is used to authenticate the user in the web application and set localStorage items.
        - `NotFound.js`: Displays a 404 Error if the user tried to enter an invalid path in the address bar.
        - `Profile.js`: Displays the profile page of the user, with statistics and budget setting.
        - `Register.js`: Displays the user form that is used to register a user into the database.
        - `Transactions.js`: Displays the various transactions the user has tracked, with options to add/filter transactions.
      - `App.js`: Main component and entry point for the application, sets up routing paths using React Router.
      - `index.js`: Renders the App component into the index.html root element.
      - `styles.css`: Contains all the CSS used in the frontend.
      - `package.json`: Contains project metadata and a list of dependencies.
      - `package-lock.json`: Contains detailed dependency tree information.
    - `public` directory: Static assets and main HTML file
      - `index.html`: The main HTML file to be rendered.
      - `manifest.json`: Provide metadata about application.
- `transaction` directory: Backend application created using django startapp
  - `init.py`: Empty file that serves as an indicator to Python that the directory is a Python package. 
  - `admin.py`: Used to register models into django admin.
  - `apps.py`: Handles application config.
  - `models.py`: Contains models of the web application.
    - There are 3 models present:
      - User: Inherited from AbstractUser with an additional starting amount field.
      - Transaction: Contains details about the transaction and the user who added it.
      - Budget: Contains details about the monthly budget and the user who set it.
  - `serializers.py`: Contains serializers for each model to be rendered into JSON responses. Serializers also validates incoming data and 
      converts parsed data back to model objects.
  - `tests.py`: Empty file meant for models testing. 
  - `urls.py`: Contains URLs for the Django REST Framework views and includes additional paths for login and logout.
  - `views.py`: Contains various views and viewsets for handling different API endpoints in the application.
- `manage.py`: Provides various commands for managing a Django project.
- `requirements.txt`: A list of Python packages to download.

## How to run 
Prerequisites: Python and NodeJS have to be installed in your system.

1. Navigate to the project directory by running the command `cd capstone/` 
  in the folder where you placed the downloaded folder.

2. Run the command `pip install -r requirements.txt` to install the neccessary python packages
   to run the web application.

3. Navigate to the frontend directory by running the command `cd frontend/`.

4. Run the command `npm install` to install the necessary node modules to run the web application.

5. Run the command `npm run build` to build the files needed to render the web application.

6. Return to the outer directory and run the command `py manage.py transaction makemigrations`, then `py manage.py migrate`
  to create the database needed for the web application.

7. To run the application, run the command `py manage.py runserver`.

Note: Make sure to use the appropriate Python command (pip, pip3, python3, py etc.) based on your system's configuration.
