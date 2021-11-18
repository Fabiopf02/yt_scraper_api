import { Request, Response } from 'express';
import Video from '../../schemas/Video';
import { ParamsDictionary } from 'express-serve-static-core';
import saveLog, { objectToString } from '../../services/saveLog';
import Log from '../../schemas/Log';

interface ReqQuery {
  q: string;
  limit: string;
  page: string;
  sortValue: string;
  sortField: string;
}

type TRequest<T> = Request<T, any, any, ReqQuery>;

export async function search(req: TRequest<ParamsDictionary>, res: Response) {
  try {
    const {
      q,
      limit = 10,
      page = 1,
      sortField = 'uploadedAt',
      sortValue = 'asc',
    } = req.query;
    const skip = Number(limit) * (Number(page) - 1);

    const rgx = new RegExp(q, 'i');
    const obj = {};
    obj[sortField] = sortValue;

    const findValues = {
      $or: [
        { channel: { $regex: rgx } },
        { title: { $regex: rgx } },
        { description: { $regex: rgx } },
        { genre: { $regex: rgx } },
      ],
    };

    const videos = await Video.find(findValues)
      .sort(obj)
      .limit(Number(limit))
      .skip(Number(skip));

    const count = await Video.find(findValues).countDocuments();

    const queries = objectToString(req.query);
    await saveLog(req, `search: ${queries}`, 'success');

    res.header('X-Total-Count', String(count));

    return res.json(videos);
  } catch (err) {
    const queries = objectToString(req.query);
    await saveLog(req, `error in search: ${queries} / ${err}`, 'fail');
    return res.status(500).json({ error: 'An error has occurred' });
  }
}
