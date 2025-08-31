const CaseStudy = require("../models/CaseStudy");

// Create new case study
exports.createCaseStudy = async (req, res) => {
  try {
    const {
      title,
      description,
      chapterId,
      tasks,
      content,
      simulations,
      questionSets,
    } = req.body;

    const caseStudy = new CaseStudy({
      title,
      description,
      chapterId,
      tasks: tasks || [],
      content: content || [],
      simulations: simulations || [],
      questionSets: questionSets || [],
    });

    await caseStudy.save();
    res.status(201).json({ success: true, data: caseStudy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all case studies for a chapter
exports.getCaseStudiesByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const caseStudies = await CaseStudy.find({
      chapterId,
      isActive: true,
    }).sort({ order: 1 });
    res.status(200).json({ success: true, data: caseStudies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single case study
exports.getCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res
        .status(404)
        .json({ success: false, error: "Case study not found" });
    }
    res.status(200).json({ success: true, data: caseStudy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update case study
exports.updateCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!caseStudy) {
      return res
        .status(404)
        .json({ success: false, error: "Case study not found" });
    }
    res.status(200).json({ success: true, data: caseStudy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete case study
exports.deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!caseStudy) {
      return res
        .status(404)
        .json({ success: false, error: "Case study not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add task to case study
exports.addTask = async (req, res) => {
  try {
    const { taskName, instructions } = req.body;
    const caseStudy = await CaseStudy.findById(req.params.id);

    if (!caseStudy) {
      return res
        .status(404)
        .json({ success: false, error: "Case study not found" });
    }

    const newTask = {
      taskName,
      instructions,
      order: caseStudy.tasks.length,
    };

    caseStudy.tasks.push(newTask);
    await caseStudy.save();

    res.status(200).json({ success: true, data: caseStudy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add content to case study
exports.addContent = async (req, res) => {
  try {
    const { type, videoBase64, textContent, richTextContent } = req.body;
    const caseStudy = await CaseStudy.findById(req.params.id);

    if (!caseStudy) {
      return res
        .status(404)
        .json({ success: false, error: "Case study not found" });
    }

    const newContent = {
      type,
      videoBase64,
      textContent,
      richTextContent,
      order: caseStudy.content.length,
    };

    caseStudy.content.push(newContent);
    await caseStudy.save();

    res.status(200).json({ success: true, data: caseStudy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add simulation to case study
exports.addSimulation = async (req, res) => {
  try {
    const { type, title, description, config, isOptional } = req.body;
    const caseStudy = await CaseStudy.findById(req.params.id);

    if (!caseStudy) {
      return res
        .status(404)
        .json({ success: false, error: "Case study not found" });
    }

    const newSimulation = {
      type,
      title,
      description,
      config,
      isOptional,
      order: caseStudy.simulations.length,
    };

    caseStudy.simulations.push(newSimulation);
    await caseStudy.save();

    res.status(200).json({ success: true, data: caseStudy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add question set to case study
exports.addQuestionSet = async (req, res) => {
  try {
    const {
      name,
      description,
      excelBase64,
      questions,
      totalQuestions,
      timeLimit,
      passingScore,
    } = req.body;
    const caseStudy = await CaseStudy.findById(req.params.id);

    if (!caseStudy) {
      return res
        .status(404)
        .json({ success: false, error: "Case study not found" });
    }

    const newQuestionSet = {
      name,
      description,
      excelBase64,
      questions,
      totalQuestions,
      timeLimit,
      passingScore,
      order: caseStudy.questionSets.length,
    };

    caseStudy.questionSets.push(newQuestionSet);
    await caseStudy.save();

    res.status(200).json({ success: true, data: caseStudy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
