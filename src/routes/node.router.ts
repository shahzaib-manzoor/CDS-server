import {Router} from 'express';
import NodeController from '../controllers/node.controller';

const router = Router();

router.put('/condition/:id/:conditionId', NodeController.updateCondition);
router.post('/decision', NodeController.decisionTreeSearch);
router.get('/', NodeController.getNodes);
router.post('/', NodeController.createNode);
router.get('/:id', NodeController.getNode);
router.put('/:id', NodeController.updateNode);
router.delete('/:id', NodeController.deleteNode);

export default router;