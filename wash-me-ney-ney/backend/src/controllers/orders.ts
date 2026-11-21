import { Request, Response } from 'express';
import { Customer, Service, Order } from '../models';

export const getOrders = async (_req: Request, res: Response) => {
  res.json(await Order.find().sort({ _id: -1 })); // newest first
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
};

// Next order code: WMNN-1001, WMNN-1002, ... (numeric max, not string sort)
async function nextCode() {
  const [latest] = await Order.aggregate([
    { $project: { n: { $toInt: { $arrayElemAt: [{ $split: ['$code', '-'] }, 1] } } } },
    { $sort: { n: -1 } },
    { $limit: 1 },
  ]);
  return `WMNN-${latest ? latest.n + 1 : 1001}`;
}

export const createOrder = async (req: Request, res: Response) => {
  const { customerId, serviceId, weight, status, payment } = req.body;
  const [customer, service] = await Promise.all([Customer.findById(customerId), Service.findById(serviceId)]);
  if (!customer || !service) return res.status(400).json({ error: 'Invalid customer or service' });

  // Retry if two requests pick the same code at once (unique index rejects the loser)
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const order = await Order.create({
        code: await nextCode(),
        customerId,
        serviceId,
        weight,
        price: service.price, // price per kg is saved with the order
        status,
        payment,
        date: new Date().toLocaleDateString('en-CA'),
      });
      return res.status(201).json(order);
    } catch (err: any) {
      if (err.code !== 11000 || attempt === 4) throw err;
    }
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });

  const { customerId, serviceId, weight, status, payment } = req.body;

  if (customerId && customerId !== String(order.customerId)) {
    if (!(await Customer.exists({ _id: customerId }))) return res.status(400).json({ error: 'Invalid customer' });
    order.set('customerId', customerId);
  }
  // Only re-price if the service changed
  if (serviceId && serviceId !== String(order.serviceId)) {
    const service = await Service.findById(serviceId);
    if (!service) return res.status(400).json({ error: 'Invalid service' });
    order.set('serviceId', serviceId);
    order.price = service.price;
  }
  if (weight !== undefined) order.weight = weight;
  if (status !== undefined) order.status = status;
  if (payment !== undefined) order.payment = payment;

  await order.save();
  res.json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
};
