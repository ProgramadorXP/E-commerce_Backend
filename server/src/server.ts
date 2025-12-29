import app from './app';
import config from './config/config';
import chalk from 'chalk';

app.listen(config.port, () => {
  console.log(chalk.green.bold(`Server running on port ${config.port}`));
});
