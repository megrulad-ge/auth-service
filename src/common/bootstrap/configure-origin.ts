import { CorsException } from '../exceptions/cors.exception';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';

export const configureOrigin: CustomOrigin = (requestOrigin, callback) => {
  const corsWhitelist = process.env.ORIGIN.split(',');
  const originNotDefined = !origin;
  const isWhitelisted = corsWhitelist.indexOf(origin) !== -1;
  const isLocalhost = new RegExp(/^https?:\/\/(localhost|127.0.0.1)/).test(origin);
  const isMegrulad = new RegExp(/^https?:\/\/(.*)\.megrulad\.ge/).test(origin);
  const corsAllowed = originNotDefined || isLocalhost || isWhitelisted || isMegrulad;

  if (corsAllowed) return callback(null, true);
  callback(new CorsException(`Origin [${origin}] Not allowed by CORS`));
};
