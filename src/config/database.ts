import chalk from 'chalk';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (MONGODB_URI: string) => {
    const connect = () => {
        mongoose
            .connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            })
            .then(() => {
                return console.log(
                    `${chalk.green(
                        'Successfully',
                    )} connected to ${chalk.italic.cyan(`${MONGODB_URI}`)}`,
                );
            })
            .catch((error) => {
                return console.error(
                    `${chalk.red(`Something went wrong, error: ${error}`)}`,
                );
            });
    };

    mongoose.set('useCreateIndex', true);

    connect();

    mongoose.connection.on('disconnected', connect);
};
