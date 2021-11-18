import { Request, Response } from 'express';
import Video, { VideoDocument } from '../../schemas/Video';
import { ParamsDictionary } from 'express-serve-static-core';
import saveLog, { objectToString } from '../../services/saveLog';

interface reqQuery {
  limit: number;
  page: number;
  sortField: number;
  sortValue: string;
}

type TRequest<T> = Request<T, any, any, reqQuery>;

export async function index(req: TRequest<ParamsDictionary>, res: Response) {
  try {
    const {
      limit = 10,
      page = 1,
      sortField = 'uploadedAt',
      sortValue = 'asc',
    } = req.query;
    const skip = Number(limit) * (Number(page) - 1);

    const obj = {};
    obj[sortField] = sortValue;

    const videos = await Video.find({})
      .sort(obj)
      .skip(skip)
      .limit(Number(limit));
    const total = await Video.find({}).countDocuments();

    res.header('X-Total-Count', String(total));

    await saveLog(
      req,
      `listed in the unfiltered list: ${objectToString(req.query)}`,
      'success',
    );

    return res.json(videos);
  } catch (err) {
    await saveLog(
      req,
      `error in unfiltered list: ${req.query} | ${err}`,
      'fail',
    );
    return res.status(500).send({ error: 'An error has occurred' });
  }
}
