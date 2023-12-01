Overview

#Country Info App

The endpoint of this web:https://my-country-info-prd-a33ac6e81522.herokuapp.com/

The Country Info App allows users to search for a country and retrieve relevant details, such as the country's name, capital, currency, population, area, region, and flags. The app uses the `restcountries.com` API to fetch this information.

The app uses the restcountries.com API to retrieve this information.

#Features

- **Search by Country**: Easily find information about any country.
- **Detailed Information**: View details like the official name, capital, currency, population, and more.
- **Interactive UI**: Enjoy smooth hover effects on the search box and other interactive elements.
- **Error Handling**: Gracefully handles errors with relevant user messages.

#Getting Started

##Prerequisites

Node.js
npm
git

##Installation

1.Clone the repo to the desired folder:

open the cli on the desired folder

cmd:git clone https://github.com/JohnsonJapow/mycountryinfo.git

2.Navigate to the project directory:

cmd:cd mycountryinfo

3.Install NPM packages:

cmd:npm install

4.Start the development server:

cmd:npm start

5.Access the app in your browser at `http://localhost:5000`.

Using the API

The app fetches country data from an external API `https://restcountries.com/#rest-countries`. 

If you face any issues, ensure the API endpoint is accessible and working.

Deployment 🌐

To deploy this app to Heroku, follow these steps:

Create a Heroku account if you don't have one and log in.

Install the Heroku CLI on your machine.

Log in to Heroku through the CLI using heroku login.

Navigate to your project directory.

Initialize a git repository if not already done using git init.

Connect your repository to Heroku using heroku git:remote -a [your-heroku-app-name].

Commit your changes using git add . and git commit -am "Initial commit".

Push your code to Heroku using git push heroku master.

Access your deployed app by navigating to https://[your-heroku-app-name].herokuapp.com in your browser.

*Replace [your-heroku-app-name] with the actual name of your Heroku app.

Built With 🛠️
React - Frontend library
Express - Backend framework
Axios - HTTP client

- **Search by Country**: Easily find information about any country.
- **Detailed Information**: View details like the official name, capital, currency, population, and more.
- **Interactive UI**: Enjoy smooth hover effects on the search box and other interactive elements.
- **Error Handling**: Gracefully handles errors with relevant user messages.

## Running Tests

To ensure the quality and functionality of the application, a suite of automated tests has been provided. Follow the steps below to run these tests:

Backend Tests with Jest:

Firstly, open the .env in root directory, then modify NODE_ENV value to test

Navigate to the root directory

Run the test suite with, run npm test


Frontend Tests with Cypress:

1.Ensure the backend server is running (in another terminal window, run npm start in the root directory).

2.Navigate to the frontend directory: cd ../frontend from the backend directory

3.Open the Cypress test runner with npx cypress open.

4.In the Cypress UI, click on 'E2E Testing'.

5.Choose the browser for testing and click 'Start E2E Testing'.

6.Select the test file .cy.js to run the specific tests.
