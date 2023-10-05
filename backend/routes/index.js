var express = require("express");
var router = express.Router();
const Users = require("../models/Users");
const Projects = require("../models/Project");
const Assets = require("../models/Assets");
const fetch = require("node-fetch");

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

    return res.json(projects.reverse());
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
    const project = await Projects.findOne({ _id: id });

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
    console.log(id);
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
    const { id, title } = req.body;
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
      previewImage: "",
      canvasHistory: {},
    });

    await creatdUserr.save();
    return res.json(creatdUserr);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});
router.get("/recently", async function (req, res, next) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.json({
        error: "Missing data query parameter",
      });
    }
    const project = await Projects.findOne({ _id: id });
    return res.json(project);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});
router.post("/recently", async function (req, res, next) {
  try {
    const { userId, projectId, recently } = req.body;
    const user = await Users.findOne({ userId: userId });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }
    const product = await Projects.findOne({ _id: projectId });
    if (!product) {
      return res.json({
        error: "product not found",
      });
    }
    // recently.date = new Date();
    // const deleter = await Projects.findByIdAndRemove({recently:recently });
    // const deleter = await Projects.findOneAndUpdate(
    //   { userId: userId, _id: projectId },
    //   {
    //     $pop: {
    //       recently: recently,
    //     },
    //   }
    // );
    // console.log(deleter);
    const updateDB = await Projects.findOneAndUpdate(
      { userId: userId, _id: projectId },
      {
        $push: {
          recently: recently,
        },
      }
    );
    console.log(userId, projectId, recently);
    return res.json(updateDB);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});

router.post("/assets", async function (req, res, next) {
  try {
    const { userId, projectId, asset, assetType } = req.body;
    console.log(userId, projectId, asset, assetType);

    const user = await Users.findOne({ userId: userId });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }
 
    console.log(userId, projectId, asset, assetType);

    const creatdUserrAssets = new Assets({
      userId: userId,
      projectId: projectId,
      url: asset,
      AssetType: assetType,
    });

    await creatdUserrAssets.save();
    console.log(creatdUserrAssets);
    return res.json(creatdUserrAssets);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});

router.delete("/assets", async function (req, res, next) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.json({
        error: "Missing _id query parameter",
      });
    }
    console.log(id);
    const deletedAssets = await Assets.findOneAndDelete({ _id: id });

    if (!deletedAssets) {
      return res.json({
        error: "Assets not found",
      });
    }

    return res.json({
      message: "Assets deleted successfully",
    });
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});

router.post("/jobId", async function (req, res, next) {
  try {
    const { userId, projectId, jobId } = req.body;
    const user = await Users.findOne({ userId: userId });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }

    const product = await Projects.findOne({ _id: projectId });
    if (!product) {
      return res.json({
        error: "product not found",
      });
    }

    const updateUserDB = await Users.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          jobIds: jobId,
        },
      }
    );

    const updateDB = await Projects.findOneAndUpdate(
      { userId: userId, _id: projectId },
      {
        $push: {
          jobIds: jobId,
        },
      }
    );
    console.log(userId, projectId, jobId);
    return res.json(updateDB);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});
router.post("/jobId3d", async function (req, res, next) {
  try {
    const { userId, projectId, jobId } = req.body;
    const user = await Users.findOne({ userId: userId });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }

    const product = await Projects.findOne({ _id: projectId });
    if (!product) {
      return res.json({
        error: "product not found",
      });
    }

    const updateUserDB = await Users.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          jobIds3D: jobId,
        },
      }
    );

    const updateDB = await Projects.findOneAndUpdate(
      { userId: userId, _id: projectId },
      {
        $push: {
          jobIds3D: jobId,
        },
      }
    );
    console.log(userId, projectId, jobId);
    return res.json(updateDB);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});
router.post("/upload/asset", async function (req, res, next) {
  try {
    const { userId, projectId, url, assetType } = req.body;
    const user = await Users.findOne({ userId: userId });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }
    console.log(assetType);
    const assertsData = new Assets({
      userId: userId,
      projectId: projectId,
      url: url,
      AssetType: assetType,
    });

    await assertsData.save();
    return res.json(assertsData);
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});

router.get("/assets", async function (req, res, next) {
  try {
    const { userId, projectId } = req.query;
    console.log(userId, projectId);

    // const { id, projectId, url } = req.body;
    const user = await Users.findOne({ userId: userId });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }
    // console.log(userId, projectId);

    let assetsList;
    if (!projectId) {
      assetsList = await Assets.find({ userId: userId });
      console.log(userId, assetsList);

      return res.json(assetsList.reverse());
    } else {
      assetsList = await Assets.find({ userId: userId, projectId: projectId });
      return res.json(assetsList.reverse());
    }
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});

router.post("/save/project", async function (req, res, next) {
  try {
    const { id, projectId, canvas } = req.body;
    console.log(id, projectId, canvas, "cvcxbvc");

    const user = await Users.findOne({ userId: id });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }

    const updateDB = await Projects.findOneAndUpdate(
      { userId: id, _id: projectId },
      {
        $set: {
          canvas: canvas,
        },
      }
    );
    if (!updateDB) {
      console.log("Product Update Failed", updateDB);
      return res.status(400).json({
        error: "User Update Failed",
      });
    }

    console.log(id, projectId, canvas, "dfdf");
    return res.json({ status: "success" });
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});
router.post("/rename", async function (req, res, next) {
  try {
    const { id, projectId, name } = req.body;
    console.log(id, projectId, name, "cvcxbvc");

    const user = await Users.findOne({ userId: id });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }

    const updateDB = await Projects.findOneAndUpdate(
      { userId: id, _id: projectId },
      {
        $set: {
          title: name,
        },
      }
    );
    if (!updateDB) {
      console.log("Product Update Failed", updateDB);
      return res.status(400).json({
        error: "User Update Failed",
      });
    }

    console.log(id, projectId, name, "dfdf");
    return res.json({ status: "success" });
  } catch (error) {
    return res.json({ error: "Server error" });
  }
});
router.post("/addPreview", async function (req, res, next) {
  try {
    const { userId, projectId, img } = req.body;
    console.log(userId, projectId, img, "cvcxbvc");

    const user = await Users.findOne({ userId: userId });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }

    const updateDB = await Projects.findOneAndUpdate(
      { userId: userId, _id: projectId },
      {
        $set: {
          previewImage: img,
        },
      }
    );
    if (!updateDB) {
      console.log("Product Update Failed", updateDB);
      return res.status(400).json({
        error: "User Update Failed",
      });
    }

    console.log(userId, projectId, img, "dfdf");
    return res.json({ status: "success" });
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

router.get("/generatedImg", async function (req, res, next) {
  try {
    const { userId, projectId } = req.query;
    if (!userId) {
      return res.json({
        error: "Missing data query parameter",
      });
    }

    const user = await Users.findOne({ userId: userId });

    if (!user) {
      return res.json({
        error: "user not found",
      });
    }

    const response = await fetch(
      `https://tvjjvhjhvxwpkohjqxld.supabase.co/rest/v1/public_images?select=*&order=created_at.desc&user_id=eq.${userId}`,
      {
        method: "GET",
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp2aGpodnh3cGtvaGpxeGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI4Njg5NDQsImV4cCI6MjAwODQ0NDk0NH0.dwKxNDrr7Jw5OjeHgIbk8RLyvJuQVwZ_48Bv71P1n3Y",
        },
      }
    );
    const data = await response.json();

    if (projectId) {
      const product = await Projects.findOne({ _id: projectId });
      const filteredResult = data.filter((obj) =>
        product.jobIds?.includes(obj?.task_id)
      );
      return res.json(filteredResult);
    }

    const filteredResult = data.filter((obj) =>
      user.jobIds?.includes(obj?.task_id)
    );

    return res.json(filteredResult);
  } catch (error) {
    console.error("Error:", error);
    return res.json({ error: "Server error" });
  }
});

module.exports = router;
