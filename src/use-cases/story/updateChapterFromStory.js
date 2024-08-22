module.exports = function updateChapterFromStory({ storyRepository }) {
  return async function (storyId, chapterId, updatedChapterData) {
    const story = await storyRepository.findById(storyId);
    if (!story) {
      throw new Error("Story not found");
    }

    const chapterIndex = story.chapters.findIndex(
      (chapter) => chapter._id.toString() === chapterId
    );
    if (chapterIndex === -1) {
      throw new Error("Chapter not found in story");
    }

    story.chapters[chapterIndex] = {
      ...story.chapters[chapterIndex]._doc,
      ...updatedChapterData,
      lastUpdated: new Date(),
    };

    return await storyRepository.update(storyId, story);
  };
};
