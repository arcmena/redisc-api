import chalk from 'chalk';

import app from './app';
import mongoose from './config/database';

const { PORT = 3030, MONGODB_URI } = process.env;

app.listen(PORT, () => {
    console.log(
        `${chalk.magenta('Server started!')} Listening on: ${chalk.bold.cyan(
            `http://localhost:${PORT}`,
        )}`,
    );
});

mongoose(MONGODB_URI || 'mongodb://localhost:27017/redisc');
