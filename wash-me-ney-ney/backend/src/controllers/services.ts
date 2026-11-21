import { Request, Response } from 'express';
import { Service, Order } from '../models';

export const getServices = async (_req: Request, res: Response) => {
  res.json(await Service.find().sort({ _id: 1 }));
};

export const getService = async (req: Request, res: Response) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ error: 'Not found' });
  res.json(service);
};

export const createService = async (req: Request, res: Response) => {
  const { name, price, detail } = req.body;
  res.status(201).json(await Service.create({ name, price, detail }));
};

export const updateService = async (req: Request, res: Response) => {
  const { name, price, detail } = req.body;
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { name, price, detail },
    { new: true, runValidators: true }
  );
  if (!service) return res.status(404).json({ error: 'Not found' });
  res.json(service);
};

export const deleteService = async (req: Request, res: Response) => {
  if (await Order.exists({ serviceId: req.params.id })) {
    return res.status(409).json({ error: 'This service is used by orders. Remove those orders first.' });
  }
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
};
