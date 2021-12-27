module.exports = class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data, options = {}) {
    return this.model.create(data, options);
  }

  update(data, condition, options = {}) {
    return this.model.update(data, { where: condition }, options);
  }

  findById(_id, include = []) {
    return this.model.findOne({ where: { id: _id }, include });
  }

  findOne(condition = {}, include = []) {
    return this.model.findOne({ where: condition, include });
  }

  findAll(condition = {}, include = {}) {
    return this.model.findAll({ where: condition, include });
  }

  delete(condition = {}) {
    return this.model.destroy({ where: condition });
  }
};
