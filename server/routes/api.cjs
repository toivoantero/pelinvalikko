const express = require('express');
const seikkailijaRouter = require('./seikkailija.cjs');
const varusteetRouter = require('./varusteet.cjs');
const authRouter = require('./auth.cjs');
const nimetRouter = require('./nimet.cjs');
const filesRouter = require('./files.cjs');
const pelaajaRouter = require('./pelaaja.cjs');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/seikkailija', seikkailijaRouter);
router.use('/varusteet', varusteetRouter);
router.use('/pelaaja', pelaajaRouter);
router.use('/nimet', nimetRouter);
router.use('/lataa', filesRouter);

module.exports = router;
