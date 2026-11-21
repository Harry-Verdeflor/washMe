import { Router } from 'express';
import { getOrders, getOrder, createOrder, updateOrder, deleteOrder } from '../controllers/orders';
import { validate } from '../middleware/validate';
import { idParams } from '../validators/common';
import { createOrderBody, updateOrderBody } from '../validators/order';

const router = Router();

router.get('/', getOrders);
router.get('/:id', validate({ params: idParams }), getOrder);
router.post('/', validate({ body: createOrderBody }), createOrder);
router.put('/:id', validate({ params: idParams, body: updateOrderBody }), updateOrder);
router.delete('/:id', validate({ params: idParams }), deleteOrder);

export default router;
