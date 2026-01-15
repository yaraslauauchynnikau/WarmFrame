const Router = require('../../../framework/Router');
const PatternRepo = require('../repositories/PatternRepo');

const router = new Router();
const repo = new PatternRepo();


router.get('/patterns', (req, res) => {
    res.json(repo.getAll());
});

router.get('/patterns/:id', (req, res) => {
    const item = repo.getById(req.params.id);
    res.json(item);
});

module.exports = router;
