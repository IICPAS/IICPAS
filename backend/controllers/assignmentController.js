import Assignment from '../models/Assignment.js';

// Create new assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, description, chapterId, tasks, content, simulations, questionSets } = req.body;
    
    const assignment = new Assignment({
      title,
      description,
      chapterId,
      tasks: tasks || [],
      content: content || [],
      simulations: simulations || [],
      questionSets: questionSets || []
    });

    await assignment.save();
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all assignments for a chapter
export const getAssignmentsByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const assignments = await Assignment.find({ chapterId, isActive: true })
      .sort({ order: 1 });
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single assignment
export const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update assignment
export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(500).json({ success: false, error: 'Assignment not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add task to assignment
export const addTask = async (req, res) => {
  try {
    const { taskName, instructions } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    const newTask = {
      taskName,
      instructions,
      order: assignment.tasks.length
    };

    assignment.tasks.push(newTask);
    await assignment.save();
    
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add content to assignment
export const addContent = async (req, res) => {
  try {
    const { type, videoBase64, textContent, richTextContent } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    const newContent = {
      type,
      videoBase64,
      textContent,
      richTextContent,
      order: assignment.content.length
    };

    assignment.content.push(newContent);
    await assignment.save();
    
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add simulation to assignment
export const addSimulation = async (req, res) => {
  try {
    const { type, title, description, config, isOptional } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    const newSimulation = {
      type,
      title,
      description,
      config,
      isOptional,
      order: assignment.simulations.length
    };

    assignment.simulations.push(newSimulation);
    await assignment.save();
    
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add question set to assignment
export const addQuestionSet = async (req, res) => {
  try {
    const { name, description, excelBase64, questions, totalQuestions, timeLimit, passingScore } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(500).json({ success: false, error: 'Assignment not found' });
    }

    const newQuestionSet = {
      name,
      description,
      excelBase64,
      questions,
      totalQuestions,
      timeLimit,
      passingScore,
      order: assignment.questionSets.length
    };

    assignment.questionSets.push(newQuestionSet);
    await assignment.save();
    
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
