import { Request, Response } from 'express';
import Video from '../../schemas/Video';
import saveLog, { objectToString } from '../../services/saveLog';

interface IParam {
  tag: string;
}

interface reqQuery {
  limit: string;
  page: string;
}

type TRequest = Request<IParam, any, any, reqQuery>;

export async function filterByTag(req: TRequest, res: Response) {
  try {
    const { tag } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skip = Number(limit) * (Number(page) - 1);

    const list = tag.split(',');

    const videosByTag = await Video.find({ keywords: { $all: list } })
      .skip(Number(skip))
      .limit(Number(limit));
    const total = await Video.find({
      keywords: { $all: list },
    }).countDocuments();

    res.header('X-Total-Count', String(total));

    const queries = objectToString(req.query);
    await saveLog(req, `listed in filterByTag: ${tag}${queries}`, 'success');

    return res.json(videosByTag);
  } catch (err) {
    const queries = objectToString(req.query);
    await saveLog(
      req,
      `error on list filterByTag: ${req.params.tag}${queries} | ${err}`,
      'fail',
    );
    return res.status(500).json({ error: 'An error has occurred' + err });
  }
}
