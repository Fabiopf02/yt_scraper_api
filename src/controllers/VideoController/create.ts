import { Request, Response } from 'express';
import Video from '../../schemas/Video';
import { ParamsDictionary } from 'express-serve-static-core';

import saveLog from '../../services/saveLog';
import getVideoData from '../../services/getVideo';

interface reqBody {
  url: string;
}

type TRequest = Request<ParamsDictionary, any, reqBody, any>;

export async function create(req: TRequest, res: Response) {
  try {
    const { url } = req.body;

    if (!url || !url.match(/.*www.youtube.com[/]watch[?]v=.*/g)) {
      return res.status(406).json({ error: 'A youtube video URL is required' });
    }

    const videoId: string = url.split('=')[1];
    if (videoId.length !== 11) {
      return res.json('An error has occurred: The URL is invalid');
    }

    const exists = await Video.findOne({ videoId });

    if (exists) {
      return res.json({
        message: 'The information already exists in the database',
      });
    }

    const videoData = await getVideoData(url);

    if (!videoData) {
      return res.json('An error has occurred: The URL is invalid');
    }

    await Video.create(videoData);

    await saveLog(req, `created: url ${url}`, 'success');

    return res.status(201).json(videoData);
  } catch (err) {
    await saveLog(req, `error on create: url ${req.body.url} | ${err}`, 'fail');
    return res.status(500).send({ error: 'An error has occurred' + err });
  }
}
