module.exports = class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data, options = {}) {
    return this.model.create(data, options);
  }

  update(data, condition) {
    return this.model.update(data, { where: condition });
  }

  findById(_id, include = []) {
    return this.model.findOne({ where: { id: _id }, include });
  }

  findOne(condition = {}) {
    return this.model.findOne({ where: condition });
  }

  findAll(condition = {}) {
    return this.model.findAll({ where: condition });
  }

  delete(condition = {}) {
    return this.model.destroy({ where: condition });
  }
};
