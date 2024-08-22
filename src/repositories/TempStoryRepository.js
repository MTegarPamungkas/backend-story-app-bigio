class TempStoryRepository {
  constructor({ TempStoryModel }) {
    this.TempStoryModel = TempStoryModel;
  }

  async save(tempStoryData) {
    const tempStory = new this.TempStoryModel(tempStoryData);
    return await tempStory.save();
  }

  async findById(tempStoryId) {
    return await this.TempStoryModel.findById(tempStoryId);
  }

  async update(tempStoryId, tempStoryData) {
    return await this.TempStoryModel.findByIdAndUpdate(
      tempStoryId,
      tempStoryData,
      { new: true }
    );
  }

  async remove(tempStoryId) {
    return await this.TempStoryModel.findByIdAndDelete(tempStoryId);
  }
}

module.exports = TempStoryRepository;
