# Events Aggregator App

Events Aggregator App - REST Api using Node and Sequelize

## Get started

### 1) Install Dependencies

```
yarn install
```

### 2) Run the Migrations

You might change the database credentials in the file `./src/config/database.js` and then run the following command:

```
yarn sequelize db:migrate
```

### 3) Start the server

To start the server at `http://localhost:3334` run the following command:

```
yarn runserver
```

##### Endpoints

- Create User - POST - `/users`
- Obtain JTW Token - POST - `/sessions`
- Update Authenticated User - PUT - `/users`
