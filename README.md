It's required the following command t create an environment variable which will store the database path. In the example the database name is blog_db. If it's not set in the terminal than the url "mongodb://localhost/blog_db" will be used by default to store the database

export DATABASE_URL=mongodb://localhost/blog_db
