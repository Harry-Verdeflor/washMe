import { Request, Response } from 'express';
import { Customer, Order } from '../models';

export const getCustomers = async (_req: Request, res: Response) => {
  res.json(await Customer.find().sort({ _id: 1 }));
};

export const getCustomer = async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Not found' });
  res.json(customer);
};

export const createCustomer = async (req: Request, res: Response) => {
  const { name, phone, email } = req.body; // already validated by middleware
  res.status(201).json(await Customer.create({ name, phone, email }));
};

export const updateCustomer = async (req: Request, res: Response) => {
  const { name, phone, email } = req.body; // already validated by middleware
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name, phone, email },
    { new: true, runValidators: true }
  );
  if (!customer) return res.status(404).json({ error: 'Not found' });
  res.json(customer);
};

export const deleteCustomer = async (req: Request, res: Response) => {
  if (await Order.exists({ customerId: req.params.id })) {
    return res.status(409).json({ error: 'This customer has orders. Remove their orders first.' });
  }
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
};
