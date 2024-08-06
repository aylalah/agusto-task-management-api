import { ShutdownMiddleware } from './shutdown.middleware';

describe('ShutdownMiddleware', () => {
  it('should be defined', () => {
    expect(new ShutdownMiddleware()).toBeDefined();
  });
});
