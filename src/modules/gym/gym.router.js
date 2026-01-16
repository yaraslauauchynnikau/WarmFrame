const controller = require('./gym.controller');

module.exports = (app) => {
    // Members
    app.get('/members', controller.getMembers);
    app.get('/members/:id', controller.getMemberById);
    app.post('/members', controller.createMember);
    app.put('/members/:id', controller.updateMember);
    app.patch('/members/:id', controller.patchMember);
    app.delete('/members/:id', controller.deleteMember);
    
    // Equipment
    app.get('/equipment', controller.getEquipment);
    app.get('/equipment/:id', controller.getEquipmentById);
    app.post('/equipment', controller.createEquipment);
    app.put('/equipment/:id', controller.updateEquipment);
    app.patch('/equipment/:id', controller.patchEquipment);
    app.delete('/equipment/:id', controller.deleteEquipment);
}