import express from 'express';
import path from 'path';

interface ServerOptions {
  port: number;
  public_path?: string;
}

export class Server {

  private app = express();
  private readonly port: number;
  private readonly public_path: string;

  constructor(options: ServerOptions) {
    const { port, public_path = 'public' } = options;
    this.port = port;
    this.public_path = public_path;
  }

  async start() {

    // * Middlewares

    // * Public folder
    this.app.use(express.static(`${ this.public_path }`));

    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${ this.public_path }/index.html`);
      res.sendFile(indexPath);
    });

    this.app.listen(this.port, () => {
      console.log(`Server listening port ${ this.port }`);
    });
  }
}