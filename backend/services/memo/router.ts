import express from 'express';
import { wrap } from '../../common/express';
import * as c from './controller';

const router = express.Router();
router.get('/', wrap(c.getMemos));
router.get('/:sk', wrap(c.getMemo));
router.post('/', wrap(c.createMemo));
router.post('/delete', wrap(c.deleteMemo));
router.post('/run', wrap(c.runSampleJob));

export default router;
