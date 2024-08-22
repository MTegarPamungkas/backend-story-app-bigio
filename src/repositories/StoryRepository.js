class StoryRepository {
  constructor({ StoryModel }) {
    this.StoryModel = StoryModel;
  }

  async save(storyData) {
    const story = new this.StoryModel(storyData);
    return await story.save();
  }

  async findAll() {
    return this.StoryModel.find();
  }

  async findById(storyId) {
    return this.StoryModel.findById(storyId);
  }

  async update(storyId, storyData) {
    return await this.StoryModel.findByIdAndUpdate(storyId, storyData, {
      new: true,
      runValidators: true,
    });
  }
}

module.exports = StoryRepository;
