import { SelectLanguageMiddleware } from './select-language.middleware';

describe('SelectLanguageMiddleware', () => {
  it('should be defined', () => {
    expect(new SelectLanguageMiddleware()).toBeDefined();
  });
});
