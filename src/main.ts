import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000`);
});
