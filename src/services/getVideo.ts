import puppeteer from 'puppeteer';
import { textToTime } from '../utils/textToTime';

import { VideoAttributes } from '../schemas/Video';

type Evaluate = [VideoAttributes, string, string];

async function getVideoData(url: string): Promise<VideoAttributes> {
  const browser = await puppeteer.launch({
  	args: [
  		'--no-sandbox'
  	]
  });

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('#content #description');

  const [data, duration, uploaded] = await page.evaluate((url): Evaluate => {
    //title
    const title = document
      .querySelector('#watch7-content meta[itemprop=name]')
      .getAttribute('content');
    //description
    const descriptionElements = document.querySelector(
      '#content #description .content',
    );
    let description = '';
    for (let i = 1; i < 45; i++) {
      const content = descriptionElements.querySelector(`:nth-child(${i})`);
      if (!content) {
        break;
      }
      description += content.textContent + ' ';
    }
    //channel
    const channel = document
      .querySelector(
        '#watch7-content span[itemprop=author] link[itemprop=name]',
      )
      .getAttribute('content');
    //channelUrl
    const channelUrl = document
      .querySelector('#watch7-content span[itemprop=author] link[itemprop=url]')
      .getAttribute('href');
    //channelId
    const channelId = document
      .querySelector('#watch7-content meta[itemprop=channelId]')
      .getAttribute('content');
    //uploaded_at
    const uploaded = document
      .querySelector('#watch7-content meta[itemprop=uploadDate]')
      .getAttribute('content');
    //avatarUrl
    const avatarUrl = document
      .querySelector('#top-row #avatar #img')
      .getAttribute('src');
    //time_duration
    const duration = document
      .querySelector('#watch7-content meta[itemprop=duration]')
      .getAttribute('content')
      .replace(/PT|S/g, '')
      .replace(/H|M/g, ':');
    //link snippets
    const Url: string[] = url.split('=');
    //videoId
    const videoId = Url[1];

    const image = `https://i.ytimg.com/vi/${Url[1]}/maxresdefault.jpg`;
    //videoUrl
    const videoUrl = url;
    //thumbnailUrl
    const thumbnailUrl = image;
    //tags
    const keywords = document
      .querySelector('meta[name=keywords]')
      .getAttribute('content')
      .split(', ');
    //genre
    const genre = document
      .querySelector('#watch7-content meta[itemprop=genre]')
      .getAttribute('content');
    //isfamilyFriendly
    const isFamilyFriendly =
      document
        .querySelector('#watch7-content meta[itemprop=isFamilyFriendly]')
        .getAttribute('content') === 'true'
        ? true
        : false;

    return [
      {
        title,
        description,
        channel,
        channelUrl,
        uploadedAt: new Date(),
        avatarUrl,
        timeDuration: 0,
        videoUrl,
        videoId,
        thumbnailUrl,
        keywords,
        genre,
        channelId,
        isFamilyFriendly,
      },
      duration,
      uploaded,
    ];
  }, url);

  data.uploadedAt = new Date(uploaded);
  data.timeDuration = textToTime(duration);

  await browser.close();

  return data;
}

export default getVideoData;
