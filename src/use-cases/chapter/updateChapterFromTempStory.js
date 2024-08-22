module.exports = function updateChapterFromTempStory({ tempStoryRepository }) {
  return async function (tempStoryId, chapterId, updatedChapterData) {
    const tempStory = await tempStoryRepository.findById(tempStoryId);
    if (!tempStory) {
      throw new Error("Temp Story not found");
    }

    const chapterIndex = tempStory.chapters.findIndex(
      (chapter) => chapter._id.toString() === chapterId
    );
    if (chapterIndex === -1) {
      throw new Error("Chapter not found in temp story");
    }

    tempStory.chapters[chapterIndex] = {
      ...tempStory.chapters[chapterIndex]._doc,
      ...updatedChapterData,
      lastUpdated: new Date(),
    };

    return await tempStoryRepository.update(tempStoryId, tempStory);
  };
};
