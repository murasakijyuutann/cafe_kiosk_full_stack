// src/api/createOrderMock.ts
export type CartItem = { id: number; name: string; price: number; quantity: number };

export const createOrder = async (orderData: { items: CartItem[] }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = orderData.items.reduce((s, i) => s + i.price * i.quantity, 0);
      resolve({
        orderNumber: Math.floor(100000 + Math.random() * 900000),
        orderedAt: new Date().toISOString(),
        status: "PENDING",
        customerName: null,
        items: orderData.items.map((i) => ({
          menuItemName: i.name,
          price: i.price,
          quantity: i.quantity,
          subtotal: i.price * i.quantity,
        })),
        totalAmount: total,
      });
    }, 600);
  });
};
