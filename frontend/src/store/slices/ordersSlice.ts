import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderStatus = 'pending'|'confirmed'|'processing'|'packed'|'shipped'|'delivered'|'cancelled';

export interface OrderItem { name: string; qty: number; price: number; }

export interface Order {
  id: string; customer: string; phone: string; email: string;
  items: OrderItem[]; itemsSummary: string;
  total: number; method: string; date: string; status: OrderStatus;
  address: string;
}

const SEED_ORDERS: Order[] = [
  { id:'ORD-1001', customer:'Ramesh Kumar',  phone:'9876543210', email:'ramesh@test.com',  address:'42 Gandhi Nagar, Mumbai', items:[{name:'Rice 5kg',qty:1,price:499},{name:'Ghee 500ml',qty:1,price:295}], itemsSummary:'Rice 5kg, Ghee 500ml', total:794,  method:'COD',    date:'2025-07-05', status:'delivered'  },
  { id:'ORD-1002', customer:'Priya Sharma',  phone:'9823456789', email:'priya@test.com',   address:'12 Andheri East, Mumbai', items:[{name:'Surf Excel 1kg',qty:1,price:138},{name:'Vim Bar',qty:1,price:75}],   itemsSummary:'Surf Excel 1kg, Vim',   total:213,  method:'Online', date:'2025-07-06', status:'pending'    },
  { id:'ORD-1003', customer:'Amit Patel',    phone:'9712345678', email:'amit@test.com',    address:'7 MG Road, Pune',         items:[{name:'Atta 10kg',qty:1,price:380},{name:'Toor Dal',qty:1,price:145}],    itemsSummary:'Atta 10kg, Toor Dal',   total:525,  method:'Online', date:'2025-07-06', status:'shipped'    },
  { id:'ORD-1004', customer:'Sunita Devi',   phone:'9601234567', email:'sunita@test.com',  address:'5 Karol Bagh, Delhi',     items:[{name:'Tata Salt',qty:2,price:28},{name:'MDH Masala',qty:1,price:55}],    itemsSummary:'Tata Salt, MDH Masala', total:83,   method:'COD',    date:'2025-07-07', status:'confirmed'  },
];

const loadOrders = (): Order[] => {
  if (typeof window === 'undefined') return SEED_ORDERS;
  try {
    const stored = localStorage.getItem('kirana_orders');
    return stored ? JSON.parse(stored) : SEED_ORDERS;
  } catch { return SEED_ORDERS; }
};

const saveOrders = (orders: Order[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kirana_orders', JSON.stringify(orders));
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { orders: loadOrders() },
  reducers: {
    placeOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'date' | 'status'>>) => {
      const newOrder: Order = {
        ...action.payload,
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      state.orders.unshift(newOrder);
      saveOrders(state.orders);
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus }>) => {
      const o = state.orders.find(o => o.id === action.payload.id);
      if (o) { o.status = action.payload.status; saveOrders(state.orders); }
    },
  },
});

export const { placeOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
