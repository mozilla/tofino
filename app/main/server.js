import * as service from './user-agent-service';
import { ProfileStorage } from '../services/storage';
import path from 'path';
import Task from 'co-task';

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

Task.spawn(function* () {
  const storage = yield ProfileStorage.open(path.join(__dirname, '..', '..'));

  console.log('starting');
  yield service.start(storage, 9090);
  console.log('done');
});
