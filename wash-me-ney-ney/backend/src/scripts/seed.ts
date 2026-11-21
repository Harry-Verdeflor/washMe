// Adds 5 sample customers, 5 services and 5 orders.
//   npm run seed            -> only runs if the database is empty
//   npm run seed -- --reset -> deletes existing customers/services/orders first
import { env } from '../config/env';
import mongoose from 'mongoose';
import { Customer, Service, Order } from '../models';

async function seed() {
  await mongoose.connect(env.MONGODB_URI);

  if (process.argv.includes('--reset')) {
    await Promise.all([Customer.deleteMany({}), Service.deleteMany({}), Order.deleteMany({})]);
  } else if ((await Customer.countDocuments()) + (await Service.countDocuments()) + (await Order.countDocuments()) > 0) {
    console.log('Database already has data. Use "npm run seed -- --reset" to replace it.');
    return;
  }

  const customers = await Customer.insertMany([
    { name: 'Juan Dela Cruz', phone: '0917 123 4567', email: 'juan@example.com' },
    { name: 'Maria Santos', phone: '0918 234 5678', email: 'maria@example.com' },
    { name: 'Alex Reyes', phone: '0919 345 6789', email: 'alex@example.com' },
    { name: 'Angela Bautista', phone: '0920 456 7890', email: 'angela@example.com' },
    { name: 'Mark Villanueva', phone: '0921 567 8901', email: 'mark@example.com' },
  ]);

  const services = await Service.insertMany([
    { name: 'Wash & Fold', price: 60, detail: 'Everyday cleaning + fresh folding' },
    { name: 'Wash Only', price: 40, detail: 'Gentle washing for your clothes' },
    { name: 'Dry Only', price: 30, detail: 'Quick tumble drying' },
    { name: 'Premium Care', price: 95, detail: 'Special care for delicate garments' },
    { name: 'Bedding & Comforters', price: 120, detail: 'Deep wash for bulky items' },
  ]);

  // [customer index, service index, weight, status, payment, date]
  const rows: [number, number, number, string, string, string][] = [
    [0, 0, 5, 'Washing', 'Unpaid', '2026-11-10'],
    [1, 3, 3, 'Ready', 'Paid', '2026-11-11'],
    [2, 1, 4, 'Pending', 'Unpaid', '2026-11-12'],
    [3, 4, 6, 'Folding', 'Unpaid', '2026-11-13'],
    [4, 2, 2, 'Completed', 'Paid', '2026-11-14'],
  ];

  await Order.insertMany(
    rows.map(([c, s, weight, status, payment, date], i) => ({
      code: `WMNN-${1001 + i}`,
      customerId: customers[c]._id,
      serviceId: services[s]._id,
      weight,
      price: services[s].price,
      status,
      payment,
      date,
    }))
  );

  console.log('Seeded 5 customers, 5 services and 5 orders.');
}

seed()
  .catch((err) => console.error(err))
  .finally(() => mongoose.disconnect());
