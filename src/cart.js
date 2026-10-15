function notImplemented() {
  throw new Error('Корзина ещё не реализована. Сначала прочитайте тесты.');
}

function addToCart(cart, product, qty) {
  if (!Number.isInteger(qty) || qty <= 0)
    throw new RangeError('не принимает нулевое количество');

  if (qty > product.stock)
    throw new RangeError(
      'не позволяет добавить больше товара, чем есть на складе'
    );

  const isProductExist = cart.find((item) => item.id === product.id);

  if (!isProductExist) {
    return [...cart, { ...product, quantity: qty }];
  }

  if (isProductExist) {
    const newQty = isProductExist.quantity + qty;

    if (newQty > product.stock)
      throw new RangeError(
        'не позволяет добавить больше товара, чем есть на складе'
      );

    return cart.map((item) =>
      item.id === product.id ? { ...item, quantity: newQty } : item
    );
  }
}

function changeQuantity(cart, id, qty) {
  if (!Number.isInteger(qty) || qty <= 0)
    throw new RangeError('не принимает нулевое количество');

  const item = cart.find((i) => i.id === id);

  if (!item) return cart;

  if (item.stock < qty)
    throw new RangeError('не позволяет указать количество больше остатка');

  return cart.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
}

function removeFromCart(cart, id) {
  const item = cart.find((i) => i.id === id);

  if (!item) return cart;

  return cart.filter((i) => i.id !== item.id);
}

function calculateCartSubtotal(cart) {
  if (cart.length === 0) return 0;

  return cart.reduce(
    (acc, current) => acc + current.price * current.quantity,
    0
  );
}

function calculateOrderTotal(cart, promo) {
  const subtotal = calculateCartSubtotal(cart);
  const discount =
    promo === 'SAVE10' && subtotal >= 20000 ? Math.floor(subtotal * 0.1) : 0;
  const delivery = subtotal >= 50000 ? 0 : 30000;

  const total = subtotal - discount + delivery;
  return { subtotal, discount, delivery, total };
}

const cartApi = {
  addToCart,
  changeQuantity,
  removeFromCart,
  calculateCartSubtotal,
  calculateOrderTotal,
};

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
