const mongoose = require("mongoose");
const addChapterToStory = require("../use-cases/story/addChapterToStory");
const removeChapterFromStory = require("../use-cases/story/removeChapterFromStory");
const addChapterToTempStory = require("../use-cases/chapter/addChapterToTempStory");
const removeChapterFromTempStory = require("../use-cases/chapter/removeChapterFromTempStory");
const updateChapterFromStory = require("../use-cases/story/updateChapterFromStory");
const updateChapterFromTempStory = require("../use-cases/chapter/updateChapterFromTempStory");

module.exports = function chapterController({
  storyRepository,
  tempStoryRepository,
}) {
  return {
    addChapterToStory: async (req, res) => {
      try {
        const { storyId } = req.params;
        const chapterData = req.body;

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
          return res.status(400).json({ error: "Invalid story ID" });
        }

        const updatedStory = await addChapterToStory({ storyRepository })(
          storyId,
          chapterData
        );
        res.status(200).json(updatedStory);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    removeChapterFromStory: async (req, res) => {
      try {
        const { storyId, chapterId } = req.params;

        if (
          !mongoose.Types.ObjectId.isValid(storyId) ||
          !mongoose.Types.ObjectId.isValid(chapterId)
        ) {
          return res
            .status(400)
            .json({ error: "Invalid story ID or chapter ID" });
        }

        const updatedStory = await removeChapterFromStory({ storyRepository })(
          storyId,
          chapterId
        );
        res.status(200).json(updatedStory);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    addChapterToTempStory: async (req, res) => {
      try {
        const { tempStoryId } = req.params;
        const chapterData = req.body;

        if (!mongoose.Types.ObjectId.isValid(tempStoryId)) {
          return res.status(400).json({ error: "Invalid temp story ID" });
        }

        const updatedTempStory = await addChapterToTempStory({
          tempStoryRepository,
        })(tempStoryId, chapterData);
        res.status(200).json(updatedTempStory);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    removeChapterFromTempStory: async (req, res) => {
      try {
        const { tempStoryId, chapterId } = req.params;

        if (
          !mongoose.Types.ObjectId.isValid(tempStoryId) ||
          !mongoose.Types.ObjectId.isValid(chapterId)
        ) {
          return res
            .status(400)
            .json({ error: "Invalid temp story ID or chapter ID" });
        }

        const updatedTempStory = await removeChapterFromTempStory({
          tempStoryRepository,
        })(tempStoryId, chapterId);
        res.status(200).json(updatedTempStory);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    updateChapterFromStory: async (req, res) => {
      try {
        const { storyId, chapterId } = req.params;
        const updatedChapterData = req.body;

        if (
          !mongoose.Types.ObjectId.isValid(storyId) ||
          !mongoose.Types.ObjectId.isValid(chapterId)
        ) {
          return res
            .status(400)
            .json({ error: "Invalid story ID or chapter ID" });
        }

        const updatedStory = await updateChapterFromStory({ storyRepository })(
          storyId,
          chapterId,
          updatedChapterData
        );
        res.status(200).json(updatedStory);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    updateChapterFromTempStory: async (req, res) => {
      try {
        const { tempStoryId, chapterId } = req.params;
        const updatedChapterData = req.body;

        if (
          !mongoose.Types.ObjectId.isValid(tempStoryId) ||
          !mongoose.Types.ObjectId.isValid(chapterId)
        ) {
          return res
            .status(400)
            .json({ error: "Invalid temp story ID or chapter ID" });
        }

        const updatedTempStory = await updateChapterFromTempStory({
          tempStoryRepository,
        })(tempStoryId, chapterId, updatedChapterData);
        res.status(200).json(updatedTempStory);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  };
};
