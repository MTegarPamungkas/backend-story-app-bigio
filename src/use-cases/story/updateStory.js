module.exports = function updateStory({ storyRepository }) {
  return async function (storyId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw new Error("Invalid story ID");
    }

    const existingStory = await storyRepository.findById(storyId);
    if (!existingStory) {
      throw new Error("Story not found");
    }

    return await storyRepository.update(storyId, updateData);
  };
};
