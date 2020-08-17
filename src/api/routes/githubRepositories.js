import express from 'express';

import GitHubRepository from '../models/githubRepositories';
import { formatGithubRepositoriesResponse } from '../utils/formatData';
import { GITHUB_REPO_QUERY } from '../../constatns/querriesConstant';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const repos = await GitHubRepository.find().select(GITHUB_REPO_QUERY).exec();
    const response = formatGithubRepositoriesResponse(repos);

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

export default router;
