import * as service from './user-agent-service';
import { ProfileStorage } from '../services/storage';
import path from 'path';

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

ProfileStorage.open(path.join(__dirname, '..', '..')).then(async function (storage) {
  await service.start(storage, 9090);
});
