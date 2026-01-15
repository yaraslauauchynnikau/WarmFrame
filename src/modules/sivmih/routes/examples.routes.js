const Router = require('../../../framework/Router');
const ExampleRepo = require('../repositories/ExampleRepo');
const parseJson = require('../../../framework/middlewares/parseJson');

const router = new Router();
const repo = new ExampleRepo();


function randomExample(patternId) {
    return {
        patternId,
        language: ["JavaScript", "Python", "Java"][Math.floor(Math.random() * 3)],
        lines: Math.floor(Math.random() * 100),
        isWorking: Math.random() > 0.2,
        tags: ["oop", "classic", "events", "demo"]
    };
}


router.get('/examples', (req, res) => {
    res.json(repo.getAll());
});

router.get('/examples/:id', (req, res) => {
    const item = repo.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Example not found' });
    res.json(item);
});

router.post('/examples', parseJson, (req, res) => {
    const patternId = req.body?.patternId || repo.getAll()[0]?.patternId || "1";
    const data = req.body && Object.keys(req.body).length ? req.body : randomExample(patternId);
    const newExample = repo.create(data);
    res.json(newExample);
});

router.put('/examples/:id', parseJson, (req, res) => {
    const updated = repo.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Example not found' });
    res.json(updated);
});

router.patch('/examples/:id', parseJson, (req, res) => {
    const patched = repo.patch(req.params.id, req.body);
    if (!patched) return res.status(404).json({ error: 'Example not found' });
    res.json(patched);
});

router.delete('/examples/:id', (req, res) => {
    const deleted = repo.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Example not found' });
    res.json({ message: 'Example deleted' });
});

module.exports = router;
