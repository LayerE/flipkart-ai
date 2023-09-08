var express = require("express");
var router = express.Router();
const Users = require("../models/Users");
const Projects = require("../models/Project");

/* GET home page. */
router.get("/user", async function (req, res, next) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.json({
        error: "Missing data query parameter",
      });
    }

    const user = await Users.findOne({ userId: id });

    if (!user) {
      const creatdUserr = new Users({
        userId: id,
        jobIds: [],
        asserts: [],
      });

      await creatdUserr.save();
      return res.json(creatdUserr);
    }
    return res.json(user);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});

router.get("/getprojects", async function (req, res, next) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.json({
        error: "Missing data query parameter",
      });
    }

    const user = await Users.findOne({ userId: id });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }
    const projects = await Projects.find({ userId: id });

    console.log(projects);

    return res.json(projects);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});
router.get("/project", async function (req, res, next) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.json({
        error: "Missing data query parameter",
      });
    }

    // const user = await Users.findOne({ userId: id });
    // if (!user) {
    //   return res.json({
    //     error: "user not found",
    //   });
    // }

    const project = await Users.findOne({ _id: id });

    return res.json(project);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});

router.delete("/project", async function (req, res, next) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.json({
        error: "Missing _id query parameter",
      });
    }
console.log(id)
    const deletedProject = await Projects.findOneAndDelete({ _id: id });

    if (!deletedProject) {
      return res.json({
        error: "Project not found",
      });
    }

    return res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});

router.post("/project", async function (req, res, next) {
  try {
    // const { id } = req.query;
    const { id, title } = req.body;

    // if (!id) {
    //   return res.json({
    //     error: "Missing data query parameter",
    //   });
    // }
    console.log(title, id)

    const user = await Users.findOne({ userId: id });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }

    const creatdUserr = new Projects({
      userId: id,
      title: title,
      jobIds: [],
      canvas: {},
      canvasHistory: {},
      asserts: [],
    });

    await creatdUserr.save();
    return res.json(creatdUserr);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});
router.get("/user", async function (req, res, next) {
  try {
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});

module.exports = router;
