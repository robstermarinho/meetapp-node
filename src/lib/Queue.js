import Bee from 'bee-queue';
import MeetupNotificationMail from '../app/jobs/MeetupNotificationMail';
import redisConfig from '../config/redis';

const jobs = [MeetupNotificationMail];
class Queue {
  constructor() {
    // We are going to create queues for each different background job
    this.queues = {};
    this.init();
  }

  // Init function
  init() {
    // For each one of the jobs
    jobs.forEach(({ key, handle }) => {
      // We create a queue and append it to queues
      // It stores the bee that connects with redis
      // It stores the handle function
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // Add this job to the queue with the params sent by jobs variable
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // Processs the jobs in real time in background
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.warn(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
