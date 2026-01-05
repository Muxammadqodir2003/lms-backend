import * as ffmpeg from 'fluent-ffmpeg';

export class VideoService {
  async getVideoDuration(videoPath: string) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const duration = data.format.duration;
          resolve(duration);
        }
      });
    });
  }
}
