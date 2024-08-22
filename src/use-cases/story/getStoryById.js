module.exports = function getStoryById({ storyRepository }) {
  return async function (storyId) {
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw new Error("Invalid story ID");
    }
    return await storyRepository.findById(storyId);
  };
};
