import express, { Router } from 'express';
import path from 'path';

interface ServerOptions {
  port: number;
  public_path?: string;
  routes: Router;
}

export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly public_path: string;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    const { port, public_path = 'public', routes } = options;
    this.port = port;
    this.public_path = public_path;
    this.routes = routes;
  }

  async start() {

    // * Middlewares
    // this.app.use(cors());
    this.app.use(express.json()) // * raw
    this.app.use(express.urlencoded({ extended: true })); // * x-www-form-urlencoded

    // * Public folder
    this.app.use(express.static(`${ this.public_path }`));

    // * Routes
    this.app.use(this.routes);

    // SPA
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${ this.public_path }/index.html`);
      res.sendFile(indexPath);
    });

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server listening port ${ this.port }`);
    });
  }

  public close() {
    this.serverListener.close();
  }
}