import * as glob from 'glob';
import { join } from 'path';

function loadHandlers(pattern: string) {
  const handlers = [];
  const files = glob.sync(pattern, { cwd: process.cwd() });
  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const handlerModule = require(join(process.cwd(), file));
    const handlerClasses = Object.values(handlerModule);
    handlers.push(...handlerClasses);
  }
  return handlers;
}

export const CommandHandlers = loadHandlers(
  'dist/application/commands/**/*.command.js',
);
export const QueryHandlers = loadHandlers(
  'dist/application/queries/**/*.query.js',
);
