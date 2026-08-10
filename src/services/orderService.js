import { appendRow, ensureTab, getRows } from '../lib/googleSheets';

const ORDER_HEADERS = ['id', 'email', 'total', 'items', 'status', 'created_at'];

export const orderService = {
  createOrder: async (orderData) => {
    await ensureTab('Orders', ORDER_HEADERS);
    const id = crypto.randomUUID();
    const row = [
      id,
      orderData.email,
      orderData.total,
      JSON.stringify(orderData.items),
      'paid',
      new Date().toISOString()
    ];
    await appendRow('Orders!A:Z', row);
    return { ...orderData, id };
  },

  getAllOrders: async () => {
    await ensureTab('Orders', ORDER_HEADERS);
    const rows = await getRows('Orders!A2:Z');
    return rows.map(row => ({
      id: row[0],
      email: row[1],
      total: Number(row[2]),
      items: JSON.parse(row[3] || '[]'),
      status: row[4],
      created_at: row[5]
    }));
  }
};