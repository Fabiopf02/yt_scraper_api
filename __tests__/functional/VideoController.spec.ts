import request, { Response } from 'supertest';
import mongoose from 'mongoose';
import Video, { VideoDocument } from '../../src/schemas/Video';

import { app } from '../../src/app';

interface IResponseVideos extends Response {
  body: VideoDocument[];
}

interface IResponseVideo extends Response {
  body: VideoDocument;
}

let videoId = '';
let channel = '';
let tag = '';
let genre = '';

describe('Create video', () => {

  beforeAll(async () => {
    await Video.deleteMany({});
  });

  it('should create a new video in the database', async () => {
    const response: IResponseVideo = await request(app)
      .post('/new')
      .send({ url: 'https://www.youtube.com/watch?v=J4BVaXkwmM8' });

    videoId = response.body.videoId;
    channel = response.body.channel;
    tag = response.body.keywords[0];
    genre = response.body.genre.split(' ')[0];

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title');
  }, 20000);
});

describe('List videos', () => {

  afterAll(async () => {
    await mongoose.connection.close();
  });

  //
  it('should list all videos', async () => {
    const response: IResponseVideos = await request(app)
      .get('/videos')
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('_id');
  });
  //
  it('should list the videos filtered by tag', async () => {
    const response: IResponseVideos = await request(app)
      .get('/tag/' + tag)
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0].videoId).toBe(videoId);
  });
  //
  it('should list the videos filtered by Channel', async () => {
    const response: IResponseVideos = await request(app)
      .get('/channel/' + channel)
      .send();

    const rgx = new RegExp(channel, 'i');

    expect(response.status).toBe(200);
    expect(response.body[0].channel).toMatch(rgx);
  });
  //
  it('should list the videos filtered by genre', async () => {
    const response: IResponseVideos = await request(app)
      .get('/genre/' + genre)
      .query({ limit: 1 });

    const rgx = new RegExp(genre, 'i')

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].genre).toMatch(rgx);
  });
  //
  it('should show a single video', async () => {
    const response: IResponseVideo = await request(app)
      .get('/video/' + videoId)
      .query({ limit: 1 });

    const rgx = new RegExp(channel, 'i');

    expect(response.status).toBe(200);
    expect(response.body.channel).toMatch(rgx);
  });
  //
  it('should show a list of videos based on the search', async () => {
    const response: IResponseVideos = await request(app)
      .get('/search')
      .query({ v: channel, limit: 1 });

    const rgx = new RegExp(channel, 'i');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].channel).toMatch(rgx);
  });
});
