module.exports = function addChapterToTempStory({ tempStoryRepository }) {
  return async function (tempStoryId, chapterData) {
    const tempStory = await tempStoryRepository.findById(tempStoryId);
    if (!tempStory) {
      throw new Error("Temp Story not found");
    }
    tempStory.chapters.push(chapterData);
    return await tempStoryRepository.update(tempStoryId, tempStory);
  };
};
