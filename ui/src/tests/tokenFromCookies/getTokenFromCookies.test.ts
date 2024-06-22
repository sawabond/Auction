import getTokenFromCookies from '../../components/utils/getTokenFromCookies';

describe('getTokenFromCookies', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  it('returns undefined if no cookies are present', () => {
    expect(getTokenFromCookies()).toBeUndefined();
  });

  it('returns undefined if the token cookie is not present', () => {
    document.cookie = 'otherCookie=value; anotherCookie=anotherValue';
    expect(getTokenFromCookies()).toBeUndefined();
  });

  it('returns the token if the token cookie is present', () => {
    document.cookie = 'token=abcd1234; otherCookie=value';
    expect(getTokenFromCookies()).toBe('abcd1234');
  });

  it('returns the correct token if multiple cookies are present', () => {
    document.cookie =
      'otherCookie=value; token=abcd1234; anotherCookie=anotherValue';
    expect(getTokenFromCookies()).toBe('abcd1234');
  });
});
