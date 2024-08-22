module.exports = function saveTempStoryToStory({
  tempStoryRepository,
  storyRepository,
}) {
  return async function (tempStoryId) {
    try {
      const tempStory = await tempStoryRepository.findById(tempStoryId);
      if (!tempStory) {
        throw new Error("Temp Story not found");
      }

      const storyData = {
        title: tempStory.title,
        synopsis: tempStory.description,
        writer: tempStory.writer,
        categoryId: tempStory.categoryId,
        tags: tempStory.tags || [],
        coverImage: tempStory.coverImage || null,
        status: tempStory.status || "Draft",
        chapters: tempStory.chapters || [],
      };

      const savedStory = await storyRepository.save(storyData);

      await tempStoryRepository.remove(tempStoryId);

      return savedStory;
    } catch (error) {
      console.error("Failed to save Temp Story to Story:", error);
      throw new Error(`Failed to save Temp Story to Story: ${error.message}`);
    }
  };
};
