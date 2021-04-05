import { Request, Response } from 'express';
import Video from '../../schemas/Video';
import saveLog from '../../services/saveLog';

interface IParamId {
  id: string;
}

export async function filterByVideo(req: Request<IParamId>, res: Response) {
  try {
    const { id } = req.params;
    const byVideoId = await Video.findOne({ videoId: id });
    if (byVideoId) {
      await saveLog(req, `listed in filterByVideo: videoId ${id}`, 'success');
      return res.json(byVideoId);
    }

    const byDocumentId = await Video.findById(id);

    await saveLog(req, `listed in filterByVideo: _id ${id}`, 'success');

    return res.json(byDocumentId);
  } catch (err) {
    await saveLog(
      req,
      `error on list filterByVideo: id ${req.params.id} | ${err}`,
      'fail',
    );
    return res.status(500).json({ error: 'An error as occurred' });
  }
}
