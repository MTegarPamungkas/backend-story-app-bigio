const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const StoryController = require("../../controllers/storyController");
const ChapterController = require("../../controllers/chapterController");

const StoryRepository = require("../../repositories/StoryRepository");
const TempStoryRepository = require("../../repositories/TempStoryRepository");

const StoryModel = require("../database/models/Story");
const TempStoryModel = require("../database/models/TempStory");

const storyRepository = new StoryRepository({ StoryModel });
const tempStoryRepository = new TempStoryRepository({ TempStoryModel });

const storyController = StoryController({
  storyRepository,
  tempStoryRepository,
});
const chapterController = ChapterController({
  storyRepository,
  tempStoryRepository,
});

router.post("/story", upload.single("coverImage"), storyController.createStory);
router.post(
  "/temp-story",
  upload.single("coverImage"),
  storyController.createTempStory
);
router.get("/story", storyController.getStories);
router.get("/story/:storyId", storyController.getStoryById);
router.put(
  "/story/:storyId",
  upload.single("coverImage"),
  storyController.updateStory
);
router.delete("/story/:storyId", storyController.deleteStory);

router.post("/story/:storyId/chapter", chapterController.addChapterToStory);
router.delete(
  "/story/:storyId/chapter/:chapterId",
  chapterController.removeChapterFromStory
);
router.put(
  "/story/:storyId/chapter/:chapterId",
  chapterController.updateChapterFromStory
);

router.post(
  "/temp-story/:tempStoryId/chapter",
  chapterController.addChapterToTempStory
);
router.delete(
  "/temp-story/:tempStoryId/chapter/:chapterId",
  chapterController.removeChapterFromTempStory
);
router.put(
  "/temp-story/:tempStoryId/chapter/:chapterId",
  chapterController.updateChapterFromTempStory
);

router.post(
  "/temp-story/:tempStoryId/save",
  storyController.saveTempStoryToStory
);

module.exports = router;
