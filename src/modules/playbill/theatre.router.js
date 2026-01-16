const controller = require('./theatre.controller');

module.exports = (app) => {
    // Plays
    app.get('/plays', controller.getPlays);
    app.get('/plays/:id', controller.getPlayById);
    app.post('/plays', controller.createPlay);
    app.put('/plays/:id', controller.updatePlay);
    app.patch('/plays/:id', controller.patchPlay);
    app.delete('/plays/:id', controller.deletePlay);
    
    // Actors
    app.get('/actors', controller.getActors);
    app.get('/actors/:id', controller.getActorById);
    app.post('/actors', controller.createActor);
    app.put('/actors/:id', controller.updateActor);
    app.patch('/actors/:id', controller.patchActor);
    app.delete('/actors/:id', controller.deleteActor);
}