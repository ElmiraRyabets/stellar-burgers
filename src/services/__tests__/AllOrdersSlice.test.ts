import { describe, test } from '@jest/globals';
import { ordersReducer, getAllOrders, initialState } from '../AllOrdersSlice';
import { mockAllOrdersSliceData } from '../mocks/MockAllOrdersSliceData';

describe('тесты ordersSlice', () => {
  test('все заказы загружены', async () => {
    const state = ordersReducer(
      initialState,
      getAllOrders.fulfilled(mockAllOrdersSliceData, 'fulfilled')
    );
    expect(state.status).toBe('succeeded');
    expect(state.orders).toEqual(mockAllOrdersSliceData.orders);
  });

  test('ошибка при загрузке всех заказов', async () => {
    const state = ordersReducer(
      initialState,
      getAllOrders.rejected(new Error('error'), 'rejected')
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('error');
  });

  test('тест загрузи при pending', async () => {
    const state = ordersReducer(initialState, getAllOrders.pending('pending'));
    expect(state.status).toBe('loading');
  });
});
