import {createServer} from 'node:http';
import {app} from '@app/index';

const server = createServer(app);

server.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000`);
});
