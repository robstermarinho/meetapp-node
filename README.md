# Events Aggregator App

Events Aggregator App - REST Api using Node and Sequelize

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
