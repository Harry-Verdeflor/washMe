import { Router } from 'express';
import customers from './customers';
import services from './services';
import orders from './orders';

const router = Router();

router.use('/customers', customers);
router.use('/services', services);
router.use('/orders', orders);

export default router;
