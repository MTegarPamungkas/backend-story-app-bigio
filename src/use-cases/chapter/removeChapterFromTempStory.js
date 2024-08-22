module.exports = function removeChapterFromTempStory({ tempStoryRepository }) {
  return async function (tempStoryId, chapterId) {
    const tempStory = await tempStoryRepository.findById(tempStoryId);
    if (!tempStory) {
      throw new Error("Temp Story not found");
    }
    tempStory.chapters = tempStory.chapters.filter(
      (chapter) => chapter._id.toString() !== chapterId
    );
    return await tempStoryRepository.update(tempStoryId, tempStory);
  };
};
