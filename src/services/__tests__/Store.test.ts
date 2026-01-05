import { rootReducer, store } from '../Store';

describe('тесты store', () => {
  test('rootReducer с UNKNOWN_ACTION возвращает начальное состояние хранилища', () => {
    const prevState = store.getState();
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(prevState);
  });
});