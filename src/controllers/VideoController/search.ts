import { Request, Response } from 'express';
import Video from '../../schemas/Video';
import { ParamsDictionary } from 'express-serve-static-core';
import saveLog, { objectToString } from '../../services/saveLog';
import Log from '../../schemas/Log';

interface ReqQuery {
  q: string;
  limit: string;
  page: string;
}

type TRequest<T> = Request<T, any, any, ReqQuery>;

export async function search(req: TRequest<ParamsDictionary>, res: Response) {
  try {
    const { q, limit = 10, page = 1 } = req.query;
    const skip = Number(limit) * (Number(page) - 1);

    const rgx = new RegExp(q, 'i');

    const videos = await Video.find({
      $or: [
        { channel: { $regex: rgx } },
        { title: { $regex: rgx } },
        { description: { $regex: rgx } },
        { genre: { $regex: rgx } },
      ],
    })
      .limit(Number(limit))
      .skip(Number(skip));

    const queries = objectToString(req.query);
    await saveLog(req, `search: ${queries}`, 'success');

    return res.json(videos);
  } catch (err) {
    const queries = objectToString(req.query);
    await saveLog(req, `error in search: ${queries} / ${err}`, 'fail');
    return res.status(500).json({ error: 'An error has occurred' });
  }
}
