import express from 'express';
import crypto from 'crypto';
import { onPing, onEvent } from '../controllers/github';

const GITHUB_SECRET = process.env.GITHUB_SECRET;
const sigHeaderName = 'x-hub-signature';
const gitHubEventHeaderKey = 'X-GitHub-Event';

const router = express.Router();

const verifyPostData = (req, res, next) => {
  const payload = JSON.stringify(req.body);
  if (!payload) {
    return next('Request body empty');
  }

  const sig = req.get(sigHeaderName) || '';
  const hmac = crypto.createHmac('sha1', GITHUB_SECRET);
  const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8');
  const checksum = Buffer.from(sig, 'utf8');

  if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
    return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${checksum})`);
  }

  return next();
};

router.post('/github', verifyPostData, async (req, res) => {
  const gitHubEvent = req.get(gitHubEventHeaderKey);

  // handle payloads
  if (gitHubEvent === 'ping') {
    onPing(req.body);
  }
  else {
    onEvent(gitHubEvent, req.body);
  }
  // SEND RESPONSE BACK
  res.status(200).send('Success');
});

export default router;
