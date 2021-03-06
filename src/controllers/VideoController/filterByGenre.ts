import { Request, Response } from 'express';
import Video from '../../schemas/Video';

import saveLog, { objectToString } from '../../services/saveLog';

interface IParam {
  genre: string;
}

interface reqQuery {
  limit: number;
  page: number;
  sortField: string;
  sortValue: string;
}

type TRequest = Request<IParam, any, any, reqQuery>;

export async function filterByGenre(req: TRequest, res: Response) {
  try {
    const { genre } = req.params;
    const {
      limit = 10,
      page = 1,
      sortField = 'uploadedAt',
      sortValue = 'asc',
    } = req.query;
    const skip = Number(limit) * (Number(page) - 1);

    const rgx = new RegExp(genre, 'i');
    const obj = {};
    obj[sortField] = sortValue;

    const info = await Video.find({ genre: { $regex: rgx } })
      .sort(obj)
      .skip(Number(skip))
      .limit(Number(limit));
    const total = await Video.find({ genre: { $regex: rgx } }).countDocuments();

    res.header('X-Total-Count', String(total));

    const queries = objectToString(req.query);
    await saveLog(
      req,
      `listed in filterByGenre: ${genre}/${queries}`,
      'success',
    );

    return res.json(info);
  } catch (err) {
    const queries = objectToString(req.query);
    await saveLog(
      req,
      `error on list filterByGenre: ${req.params.genre}/${queries} | ${err}`,
      'fail',
    );
    return res.status(500).json({ error: 'An error has occurred' });
  }
}
