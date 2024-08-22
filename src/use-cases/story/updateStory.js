module.exports = function updateStory({ storyRepository }) {
  return async function (storyId, updateData) {
    // Validasi ID
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw new Error("Invalid story ID");
    }

    // Cari story berdasarkan ID
    const existingStory = await storyRepository.findById(storyId);
    if (!existingStory) {
      throw new Error("Story not found");
    }

    // Update story
    return await storyRepository.update(storyId, updateData);
  };
};
