import pactum from 'pactum';
import { BASE_URL } from './config.js';

// Side-effect module: configure Pactum globally for this process.
pactum.request.setBaseUrl(BASE_URL);

