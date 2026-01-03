import app from './app';
import { env } from './config/config';
import chalk from 'chalk';

app.listen(env.PORT, () => {
  console.log(chalk.green.bold(`Server running on port ${env.PORT}`));
});
