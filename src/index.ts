import chalk from 'chalk';

import mongoose from './config/database';

import HTTPServer from './server';

const app = new HTTPServer();

const { PORT = 3030, MONGODB_URI } = process.env;

app.listen(PORT, () => {
    console.log(
        `${chalk.magenta('Server started!')} Listening on: ${chalk.bold.cyan(
            `http://localhost:${PORT}`,
        )}`,
    );
});

mongoose(MONGODB_URI!);
