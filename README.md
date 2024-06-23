### How to Run the Service
1. Make sure you have ```npm``` and ```node```
2. Clone this package.
3. Change directory to the package and run ```npm install```
4. Run ```node app.js```
5. The service will be up on ```http://localhost:3000``` 

The main reason I did not dockerize this project because at the time of implementing this project I was in Windows and I did not want to deal with docker on Windows.
---


# KoaHealth Face Encoder Design

## Table of Contents
1. [Goal](#goal)
    1. [Requirements](#requirements)
2. [Design Decisions](#design-decisions)
3. [Endpoints](#endpoints)
    1. [/ping](#ping)
    2. [/register](#register)
    3. [/login](#login)
    4. [Create /activity](#create-activity)
    5. [Read /activity/{id}](#read-activityid)
    6. [Update /activity/{id}](#update-activityid)
    7. [Complete /activity{id}](#complete-activityid)
    8. [/activities](#activities)
    9. [/completed](#completed)
5. [Post Implementation Decision](#post-implementation-decisions)

## Goal

The goal of this project is to create a secure Node.js service that enables users to register, login, list various mental health activities and mark them as completed. Additionally an API should be available to create new activities. There are no requirements regarding availability, extendability, latency and testing therefore my main focus will be on creating a working service.

### Requirements
- Customers will be able to register using email, password and username.
- Customers will be able to login and get an authentication key to use for other API calls.
- Customers will be able to list all the activites.
- Customers will be able to mark the activites as completed.
- Customers will be able to list the completed activities.
- The activities should be categorized into following categories: Relaxation, Self-Esteem, Productivity, Physical Health, Social Connection.
- Customers will be able to create new activities.
- The service needs to use a database.


## Design Decisions

### Customers will be able to register.
I will keep it simple and just store email, hashed password and username. There will not be any confirmation or password reset emails. Email and username will be unique.

For this I need to create a database table called **User** and have the required fields.

### Customers will be able to login and get an authetication key.
The recommendation here is using JWT therefore I will use JWT. The token expiration will be set to 24 hours. 

### Customers will be able to list all the activites.
This requirement by itself is very simple. I can just have an **Activity** table and just list the elements on it. With this approach I can even cache the data on this table and reduce the latency. 

The only problem left would be populating the database during service start up. I can have a seeder to solve this but I think I will just manually create the database and the tables.

But the following requirement changes how I approach this requirement.

In any case I will need to create a database table called **Activity** which will have the following fields:
- id
- category id
- title
- description
- duration (in minutes)
- difficulty level
- content
- created at

Since there are relations of this schema I will also need to create:
**Category**
- id
- title


**DifficultyLevel**
- level

I will create a database schema to give more details.

### Customers will be able to mark the activites as completed.
Since every customer will want to mark their own activities as completed this requirement forces us to create a relation table between **User** and **Activity** called **UserActivity** with the following fields:
- user id
- activity id
- is completed

Because of this, during user creation **UserActivity** table needs to be populated with the activity relations of the new user during registration. This operation can be very expensive if the number of activities is very high.

### Customers will be able to list the completed activities.
This can be done by either having a filter option for the endpoint that provides the list of activites or can have a dedicated endpoint that only lists the completed activities.

Since extendability is not one of the requirements(meaning there will not be any other filters) I will follow YAGNI and will not create a filter option for the list of activities. 

I will have a dedicated endpoint just to list completed activities. This may seem not clean but in actuality having optimized joins for your frequently used database queries is a valid strategy and this approach will enable that.

### Activities should belong to categories.
As I said above I will create a seperate table for **Category**. This table will not be editable therefore ıt will not have any CRUD endpoints. I will create this table manually but seeding the database during startup is also an option.

### Customers will be able to create new activities.
Because of the example given in the task my initial assumption here is that when a new activity is created all users will get access to it. Meaning that the users will not be able to create activities to themselves. But this requirement raises a few concerns.

#### Should all users be able to create new activities or should this functionality can only be used by specific users(admin/data provider user)?
I will keep it simple and let every user be able to create new activities. I know this is not the ideal case but I don't want to keep track of a new table for this kind of integrations.

#### When a new activity is created should we backfill the **UserActivity**?
Although allowing only the new users after the creation of activity to have access to the new activity is much easier, I think if a new activity is created all users should see it on their lists. Therefore when a new activity is created I will create the necessary **UserActivity**. This operation is very expensive and can be time consuming therefore in an ideal world I would do this using a message queue, updating the database gradually but for this application I will do everything at once.

### The service needs to use a database.
Although the task recommends using **MongoDB** or **Postgres** I will use **sqlite** as a database becuase I just want to have a single service up and running without any dependencies. I want anyone to be able to clone this repository and just run the service without needing docker, docker-compose or anything else. 

In the end I'm expecting the database to look like below:

![DB Schema](https://i.imgur.com/d87wgxT.png)

And the service structure to look like

![Service Schema](https://i.imgur.com/MunotS1.png)

For this implementation I will not utilize any caching but I can go into further details where and how a cache can be utilized during system design interview.


## Endpoints
### ping

Accepts: GET

Returns: 200

A health check endpoint validate the service is up and running.

### register

Accepts: POST - JSON

Returns: 200, 400

The endpoint to create users. A user will be created using the data that is sent. A regular flow follow:

1. Request hits the endpoint.
2. User service checks whether the email already exists in the database.
3. User service checks whether the username already exists in the database.
4. Password and password confirmation are hashed.
5. Password and password confirmation hashed are compared to see if they match.
6. username, email and password hash is saved to the database.
7. All activity relations are created for the user.
8. Service responds with success.


### login
Accepts: POST - JSON

Returns: 200, 400, 401

The endpoint to log the user and return them a JWT token. Regular flow:

1. Request hits endpoint.
2. Service checks if the username exists.
3. Service hashes the password and compares it with the database entry.
4. Service creates a JWT token with the username.
5. Service returns the JWT token.


### Create activity
Accepts: POST - JSON

Returns: 200, 400, 401

This endpoint will allow any user with a JWT token to create new activities. A regular flow will be like:
1. Request hits the endpoint.
2. Service checks if the JWT token is valid.
3. A new activity is created and saved to the database.
4. For all the users the activity relations are created.
5. Service responds with success.

### Read activity/{id}
Accepts: GET

Returns: 200, 204, 401

This endpoint will allow any user to get the details of a single activity. Regular flow:
1. Request hits the endpoint.
2. Service checks if the JWT token is valid.
3. Service gets the activity with the {id}
4. Service returns the activity details.

### Update activity/{id}
Accepts: POST

Returns: 200, 204, 400, 401

This endpoint will allow any user to update the details of a single activity. Regular flow:
1. Request hits the endpoint.
2. Service checks if the JWT token is valid.
3. Service updates the activity with the {id} with the request data.
4. Service returns the activity details.

### Complete activity/{id}
Accepts: PATCH

Returns: 200, 204, 400, 401

This endpoint will allow any user to mark an activity as completed. Regular flow:
1. Request hits the endpoint.
2. Service checks if the JWT token is valid.
3. Service updates the activity with the {id} for the user as completed or incomplete based on the request.
4. Service responds with success.

### activities
Accepts: GET

Returns: 200, 401

This endpoint will list all the activities of a given user. Flow:
1. Request hits the endpoint.
2. Service checks if the JWT token is valid.
3. Service gathers all the activites of the user from the database.
4. Service returns the activity details.


### completed
Accepts: GET

Returns: 200, 401

This endpoint will do pretty much the same operations of /activities endpoınt with the difference of returning only the completed activities.
1. Request hits the endpoint.
2. Service checks if the JWT token is valid.
3. Service gathers all the activites of the user that are marked completed from the database.
4. Service returns the activity details.



## Post Implementation Decisions
- When I was just about to finish writing the design I realized I'm missing an endpoint to mark activities as completed. Therefore it is missing in the schema.
