import { Request, Response } from 'express';
import Video from '../../schemas/Video';

import saveLog, { objectToString } from '../../services/saveLog';

interface IParamChannel {
  channel: string;
}

interface reqQuery {
  limit: number;
  page: number;
  sortField: string;
  sortValue: string;
}

type TRequest<T> = Request<T, any, any, reqQuery>;

export async function filterByChannel(
  req: TRequest<IParamChannel>,
  res: Response,
) {
  try {
    const { channel } = req.params;
    const {
      limit = 15,
      page = 1,
      sortField = 'uploadedAt',
      sortValue = 'asc',
    } = req.query;
    const skip = Number(limit) * (Number(page) - 1);

    const rgx = new RegExp(channel, 'i');
    const obj = {};
    obj[sortField] = sortValue;

    const info = await Video.find({ channel: { $regex: rgx } })
      .sort(obj)
      .skip(Number(skip))
      .limit(Number(limit));
    const total = await Video.find({ channel }).countDocuments();

    res.header('X-Total-Count', String(total));

    const queries = objectToString(req.query);
    await saveLog(
      req,
      `listed in filterByChannel: ${channel}${queries}`,
      'success',
    );

    return res.json(info);
  } catch (err) {
    const queries = objectToString(req.query);
    await saveLog(
      req,
      `error on list filterByChannel: ${req.params.channel}${queries} | ${err}`,
      'fail',
    );
    return res.status(500).json({ error: 'An error has occurred' });
  }
}
