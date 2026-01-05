const testUrl = 'http://localhost:4000';
const burgerIngredients = '[data-cy=burger-ingredients]';
const burgerBunTop = '[data-cy=burger-bun-top]';
const burgerBunBottom = '[data-cy=burger-bun-bottom]';
const bunsConstructor = '[data-cy=ingredients-buns]';
const mainsConstructor = '[data-cy=ingredients-mains]';
const saucesConstructor = '[data-cy=ingredients-sauces]';
const closeModal = '[data-cy=modal]';
const orderButton = '[data-cy=order-button]';
const orderNumber = '[data-cy=order-number]';

describe('тесты конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });
  it('добавление ингредиентов в конструктор', () => {
    cy.get(mainsConstructor).contains('Добавить').click();
    cy.get(saucesConstructor).contains('Добавить').click();
    cy.get(bunsConstructor).contains('Добавить').click();

    cy.get(burgerIngredients)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get(burgerIngredients).contains('Соус Spicy-X').should('exist');
    cy.get(burgerBunTop).contains('Краторная булка N-200i').should('exist');
    cy.get(burgerBunBottom).contains('Краторная булка N-200i').should('exist');
  });
});

describe('открытие и закрытие модельного окна', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });

  it('открывается модальное окно при клике на ингредиент', () => {
    cy.contains('Описание ингредиента').should('not.exist');
    cy.contains('Биокотлета из марсианской Магнолии').click();
    cy.contains('Описание ингредиента').should('exist');
    cy.get('#modals')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });

  it('закрывается при клике на крестик', () => {
    cy.contains('Биокотлета из марсианской Магнолии').click();
    cy.contains('Описание ингредиента').should('exist');
    cy.get(closeModal).click();
    cy.contains('Описание ингредиента').should('not.exist');
  });
});

describe('оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'userInfo.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    // cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
    //   'postOrder'
    // );
    window.localStorage.setItem('refreshToken', JSON.stringify('refreshToken'));
    cy.setCookie('accessToken', 'accessToken');
    cy.visit(testUrl);
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearCookies();
  });

  it('сборка заказа', () => {
    cy.get(mainsConstructor).contains('Добавить').click();
    cy.get(saucesConstructor).contains('Добавить').click();
    cy.get(bunsConstructor).contains('Добавить').click();

    cy.get(orderButton).click();
    cy.get(orderNumber).contains('1').should('exist');

    cy.get(closeModal).click();
    cy.get(orderNumber).should('not.exist');

    cy.get(burgerIngredients)
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
    cy.get(burgerIngredients).contains('Соус Spicy-X').should('not.exist');
    cy.get(burgerIngredients).contains('Краторная булка N-200i').should('not.exist');
    cy.get(burgerIngredients)
      .contains('Краторная булка N-200i')
      .should('not.exist');
  });
});
