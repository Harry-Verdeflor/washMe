import { LayoutDashboard, ShoppingBag, Users, Layers } from 'lucide-react';

export const STATUSES = ['Pending', 'Washing', 'Drying', 'Folding', 'Ready', 'Completed', 'Cancelled'];

export const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'services', label: 'Services', icon: Layers },
];
