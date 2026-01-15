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
const parseJson = require('../../../framework/middlewares/parseJson');


router.post('/patterns', parseJson, (req, res) => {
    const newPattern = repo.create(req.body);
    res.json(newPattern);
});


router.put('/patterns/:id', parseJson, (req, res) => {
    const updated = repo.update(req.params.id, req.body);
    res.json(updated);
});


router.patch('/patterns/:id', parseJson, (req, res) => {
    const patched = repo.patch(req.params.id, req.body);
    res.json(patched);
});


router.delete('/patterns/:id', (req, res) => {
    repo.delete(req.params.id);
    res.json({ message: 'Pattern deleted' });
});

module.exports = router;
