import { textToTime } from '../../src/utils/textToTime';
import mongoose from 'mongoose';

describe('time convertion', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });
  it('should be the number of seconds converted from the text', () => {
    const seconds = textToTime('50:00');

    expect(seconds).toBe(3000);
  });
});
