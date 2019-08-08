# Meetup - Events Scheduler App

This is a solution to Events Scheduler. Built as a REST Api using Node.js and Sequelize

## Get started

### 1) Install Dependencies

```
yarn install
```

### 2) Create the `.env` file

Create the `.env` file based on `.env.example` file.

### 3) Run the Migrations

```
yarn sequelize db:migrate
```

### 4) Start the server

To start the server at `http://localhost:3334` run the following command:

```
yarn runserver
```

##### Endpoints

- Create User - POST - `/users`
- Obtain JTW Token - POST - `/sessions`
- Update Authenticated User - PUT - `/users`
- List of meetups in a day - GET - `/meetups`
- List of meetups that the user is organizing - GET - `/organizing`
- Store a meetup - POST - `/meetups`
- Update a meetup - PUT - `/meetups/:id`
- Delete a meetup - DELETE - `/meetups/:id`
- Subscribe to a meetup - POST - `/meetups/:id/subscriptions`
- Store a file - POST - `/files`
