import { Request } from 'express';
import Log from '../schemas/Log';

type TRequest<T, P> = Request<T, any, any, P>;

export function objectToString(obj: object): String {
  const _keys = Object.keys(obj);
  const _values: String[] = Object.values(obj);
  let str = '';
  _keys.forEach((v, i) => {
    str += `?${v}=` + _values[i].replace(/\s/g, '+');
  });
  return str;
}

export default async function saveLog<T, P>(
  req: TRequest<T, P>,
  message: string,
  status: string,
): Promise<void> {
  try {
    const { ip, path, method } = req;
    const user_agent = req.headers['user-agent'];

    await Log.create({ ip, path, method, user_agent, message, status });
    return;
  } catch (err) {
    return;
  }
}
