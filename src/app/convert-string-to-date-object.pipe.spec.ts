import { ConvertStringToDateObjectPipe } from './convert-string-to-date-object.pipe';

describe('ConvertStringToDateObjectPipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertStringToDateObjectPipe();
    expect(pipe).toBeTruthy();
  });

  it('should convert formatted date and time to a Date object', () => {
    const formattedDateTime = '2019-12-10 03:34:38';
    const pipe = new ConvertStringToDateObjectPipe();
    const result = pipe.transform(formattedDateTime);
    expect(result).toEqual(new Date(formattedDateTime));
  });

  it('should append 0 hour, 0 minutes and 0 seconds to a Date object', () => {
    const formattedDate = '2019-12-10';
    const pipe = new ConvertStringToDateObjectPipe();
    const result = pipe.transform(formattedDate);
    expect(result).toEqual(new Date(formattedDate + ' 00:00:00'));
  });

  it('should return null when given null', () => {
    const nullInput = null;
    const pipe = new ConvertStringToDateObjectPipe();
    const result = pipe.transform(nullInput);
    expect(result).toBe(null);
  });

  it('should return null when given an invalid string', () => {
    const invalidInput = 'ABCDEFG';
    const pipe = new ConvertStringToDateObjectPipe();
    const result = pipe.transform(invalidInput);
    expect(result).toBe(null);
  });
});
