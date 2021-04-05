import { Router } from 'express';
import VideoController from './controllers/VideoController';

const routes = Router();

routes.get('/videos', VideoController.index);
routes.get('/search', VideoController.search);
routes.get('/tag/:tag', VideoController.filterByTag);
routes.get('/channel/:channel', VideoController.filterByChannel);
routes.get('/genre/:genre', VideoController.filterByGenre);
routes.get('/video/:id', VideoController.filterByVideo);

routes.post('/new', VideoController.create);

export { routes };
