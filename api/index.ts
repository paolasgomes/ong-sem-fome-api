import moduleAlias from 'module-alias';
import path from 'path';

moduleAlias.addAliases({
  '@': path.join(__dirname, '..', 'src'),
});

import 'dotenv/config';
import app from '../src/app';

export default app;
