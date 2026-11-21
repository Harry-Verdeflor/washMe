import { Router } from 'express';
import { getServices, getService, createService, updateService, deleteService } from '../controllers/services';
import { validate } from '../middleware/validate';
import { idParams } from '../validators/common';
import { serviceBody } from '../validators/service';

const router = Router();

router.get('/', getServices);
router.get('/:id', validate({ params: idParams }), getService);
router.post('/', validate({ body: serviceBody }), createService);
router.put('/:id', validate({ params: idParams, body: serviceBody }), updateService);
router.delete('/:id', validate({ params: idParams }), deleteService);

export default router;
