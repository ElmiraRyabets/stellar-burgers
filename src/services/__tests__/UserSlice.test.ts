import { describe, test } from '@jest/globals';
import {
  getUser,
  getUserOrders,
  initialState,
  loginUser,
  loginSuccess,
  newUserOrder,
  setLastOrder,
  updateUser,
  logoutUser,
  userReducer,
  getOrderByNumber
} from '../userSlice';
import { mockUser, mockOrders, mockNewOrder } from '../mocks/MockUserSliceData';

describe('тесты UserSlice', () => {
  describe('логин пользователя', () => {
    test('запрос fulfilled', () => {
      const state = userReducer(
        initialState,
        loginUser.fulfilled(mockUser, 'fulfilled', {
          email: mockUser.user.email,
          password: 'qwerty'
        })
      );

      expect(state.status).toBe('succeeded');
      expect(state.data).toEqual(mockUser.user);
      expect(state.isAuthenticated).toBe(true);
    });

    test('запрос pending', () => {
      const state = userReducer(
        initialState,
        loginUser.pending('pending', {
          email: mockUser.user.email,
          password: 'qwerty'
        })
      );

      expect(state.status).toBe('loading');
    });

    test('запрос rejected', () => {
      const state = userReducer(
        initialState,
        loginUser.rejected(new Error('error'), 'rejected', {
          email: mockUser.user.email,
          password: 'qwerty'
        })
      );

      expect(state.status).toBe('failed');
      expect(state.data).toEqual(initialState.data);
    });
  });

  describe('обновление данных пользователя', () => {
    test('запрос fulfilled', () => {
      const state = userReducer(
        initialState,
        updateUser.fulfilled(mockUser, 'fulfilled', {
          email: mockUser.user.email,
          name: mockUser.user.name,
          password: 'qwerty'
        })
      );
      expect(state.status).toBe('succeeded');
      expect(state.data).toEqual(mockUser.user);
    });

    test('запрос pending', () => {
      const state = userReducer(
        initialState,
        updateUser.pending('fulfilled', {
          email: mockUser.user.email,
          name: mockUser.user.name,
          password: 'qwerty'
        })
      );
      expect(state.status).toBe('loading');
    });

    test('запрос rejected', () => {
      const state = userReducer(
        initialState,
        updateUser.rejected(new Error('error'), 'rejected', {
          email: mockUser.user.email,
          name: mockUser.user.name,
          password: 'qwerty'
        })
      );
      expect(state.status).toBe('failed');
    });
  });

  describe('получение пользователя', () => {
    test('запрос fulfilled', () => {
      const state = userReducer(
        initialState,
        getUser.fulfilled(mockUser, 'fulfilled')
      );
      expect(state.data).toEqual(mockUser.user);
      expect(state.status).toBe('succeeded');
      expect(state.isAuthenticated).toBe(true);
    });

    test('запрос pending', () => {
      const state = userReducer(initialState, getUser.pending('pending'));
      expect(state.status).toBe('loading');
    });

    test('запрос rejected', () => {
      const state = userReducer(
        initialState,
        getUser.rejected(new Error('error'), 'rejected')
      );
      expect(state.data).toEqual(initialState.data);
      expect(state.status).toBe('failed');
    });
  });

  describe('выход из аккакуна пользователя', () => {
    test('запрос fulfilled', () => {
      const state = userReducer(
        initialState,
        logoutUser.fulfilled({ success: false }, 'fulfilled')
      );
      expect(state.status).toBe('succeeded');
      expect(state.data).toEqual(initialState.data);
    });

    test('запрос pending', () => {
      const state = userReducer(initialState, logoutUser.pending('fulfilled'));
      expect(state.status).toBe('loading');
    });

    test('запрос rejected', () => {
      const state = userReducer(
        initialState,
        logoutUser.rejected(new Error('error'), 'rejected')
      );
      expect(state.status).toBe('failed');
    });
  });

  describe('заказы пользователя', () => {
    test('запрос fulfilled', () => {
      const state = userReducer(
        initialState,
        getUserOrders.fulfilled(mockOrders.orders, 'fulfilled')
      );
      expect(state.status).toBe('succeeded');
      expect(state.orders).toEqual(mockOrders.orders);
    });

    test('запрос pending', () => {
      const state = userReducer(
        initialState,
        getUserOrders.pending('fulfilled')
      );
      expect(state.status).toBe('loading');
    });

    test('запрос rejected', () => {
      const state = userReducer(
        initialState,
        getUserOrders.rejected(new Error('error'), 'rejected')
      );
      expect(state.status).toBe('failed');
    });
  });

  describe('новый заказ', () => {
    test('запрос fulfilled', () => {
      const state = userReducer(
        initialState,
        newUserOrder.fulfilled(mockNewOrder, 'fulfilled', [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa0940'
        ])
      );
      expect(state.status).toBe('succeeded');
      expect(state.orders[0]).toEqual(mockNewOrder.order);
      expect(state.lastOrder).toEqual(mockNewOrder.order);
      expect(state.orderRequestData).toBe(false);
    });

    test('запрос pending', () => {
      const state = userReducer(
        initialState,
        newUserOrder.pending('fulfilled', [])
      );
      expect(state.status).toBe('loading');
      expect(state.orderRequestData).toEqual(true);
    });

    test('запрос rejected', () => {
      const state = userReducer(
        initialState,
        newUserOrder.rejected(new Error('error'), 'rejected', [])
      );
      expect(state.status).toBe('failed');
      expect(state.orderRequestData).toBe(false);
    });
  });

  test('успешная авторизация', () => {
    const state = userReducer(initialState, loginSuccess());
    expect(state.status).toBe('succeeded');
  });

  test('обновление последнего заказа', () => {
    const state = userReducer(initialState, setLastOrder(mockOrders.orders[0]));
    expect(state.lastOrder).toBe(mockOrders.orders[0]);
  });

  describe('получение заказа по номеру', () => {
    test('запрос fulfilled', () => {
      const state = userReducer(
        initialState,
        getOrderByNumber.fulfilled(mockOrders, 'fulfilled', 98343)
      );
      expect(state.status).toBe('succeeded');
      expect(state.currentOrder).toEqual(mockOrders);
    });

    test('запрос pending', () => {
      const state = userReducer(
        initialState,
        getOrderByNumber.pending('pending', 98343)
      );
      expect(state.status).toBe('loading');
    });

    test('запрос rejected', () => {
      const state = userReducer(
        initialState,
        getOrderByNumber.rejected(new Error('error'), 'rejected', 98343)
      );
      expect(state.status).toBe('failed');
    });
  });
});
