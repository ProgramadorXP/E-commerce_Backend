import chalk from 'chalk';
import app from './app';
import { env } from './config/config';
import { prisma } from './lib/prisma';

const server = app.listen(env.PORT, () => {
  console.log(chalk.green.bold(`Server running on port ${env.PORT}`));
});

const gracefulShutdown = async (signal: string) => {
  console.log(
    chalk.yellow(`\nReceived ${signal}. Starting graceful shutdown...`),
  );

  server.close(async () => {
    console.log(chalk.yellow('HTTP server closed.'));

    try {
      await prisma.$disconnect();
      console.log(chalk.yellow('Database connection closed.'));
      process.exit(0);
    } catch (err) {
      console.error(chalk.red('Error during database disconnection:'), err);
      process.exit(1);
    }
  });

  // Force close after 10s if it hasn't finished
  setTimeout(() => {
    console.error(
      chalk.red(
        'Could not close connections in time, forcefully shutting down',
      ),
    );
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
