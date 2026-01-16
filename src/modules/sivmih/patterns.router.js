const controller = require('./patterns.controller');

module.exports = (app) => {
    //patterns
    app.get('/patterns', controller.getPatterns);
    app.get('/patterns/:id', controller.getPatternById);
    app.post('/patterns', controller.createPattern);
    app.put('/patterns/:id', controller.updatePattern);
    app.patch('/patterns/:id', controller.patchPattern)
    app.delete('/patterns/:id', controller.deletePattern);
    
    //examples
    app.get('/examples', controller.getExamples);
    app.get('/examples/:id', controller.getExampleById);
    app.post('/examples', controller.createExamples);
    app.put('/examples/:id', controller.updateExamples);
    app.patch('/examples/:id', controller.patchExamples)
    app.delete('/examples/:id', controller.deleteExamples);
}