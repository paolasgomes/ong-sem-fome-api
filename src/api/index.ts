// api/index.ts
import 'dotenv/config';
import serverless from 'serverless-http';
import app from '../app';

const handler = serverless(app);

export default handler;
