import {Router} from 'express';
import TreeController from '../controllers/tree.controller';

const router = Router();

router.get('/', TreeController.getDecisionTrees);
router.post('/', TreeController.createDecisionTree);
router.get('/:id', TreeController.getDecisionTree);
router.put('/:id', TreeController.updateDecisionTree);
router.delete('/:id', TreeController.deleteDecisionTree);

export default router;