import { LogRequestMiddleware } from './log-request.middleware';

describe('LogRequestMiddleware', () => {
  it('should be defined', () => {
    expect(new LogRequestMiddleware()).toBeDefined();
  });
});
