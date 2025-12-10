import moduleAlias from 'module-alias';
import path from 'path';

// Registrar aliases para funcionar na Vercel
moduleAlias.addAliases({
  '@': path.join(__dirname, '..', 'src'),
});

import 'dotenv/config';
import app from '../src/app';

console.log('DATABASE_URL em produção:', process.env.DATABASE_URL);

export default app;
