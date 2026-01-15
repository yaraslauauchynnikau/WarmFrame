const Router = require('../../../framework/Router');
const ExampleRepo = require('../repositories/ExampleRepo');

const router = new Router();
const repo = new ExampleRepo();


router.get('/examples', (req, res) => {
    res.json(repo.getAll());
});

router.get('/examples/:id', (req, res) => {
    const item = repo.getById(req.params.id);
    res.json(item);
});

module.exports = router;
