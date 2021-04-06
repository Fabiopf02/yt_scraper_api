import { Router, Request, Response } from 'express';
import VideoController from './controllers/VideoController';

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  return res.redirect('https://github.com/Fabiopf02/yt_scraper_api#rotas');
});

routes.get('/videos', VideoController.index);
routes.get('/search', VideoController.search);
routes.get('/tag/:tag', VideoController.filterByTag);
routes.get('/channel/:channel', VideoController.filterByChannel);
routes.get('/genre/:genre', VideoController.filterByGenre);
routes.get('/video/:id', VideoController.filterByVideo);

routes.post('/new', VideoController.create);

export { routes };
