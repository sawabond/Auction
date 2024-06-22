import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
} from '../../store/counterSlice';

describe('counter reducer', () => {
  const initialState = { value: 0 };

  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
    });
  });

  it('should handle increment', () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(1);
  });

  it('should handle decrement', () => {
    const actual = counterReducer(initialState, decrement());
    expect(actual.value).toEqual(-1);
  });

  it('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(5));
    expect(actual.value).toEqual(5);
  });
});
