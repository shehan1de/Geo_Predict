const Query = require("../Model/Query");
const sendAnswerEmail = require("../Service/sendAnswerEmail");

const getAllQueries = async (req, res) => {
  try {
      const queries = await Query.find();
      return res.status(200).json(queries);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const submitQuery = async (req, res) => {
    const { email, question } = req.body;
  
    if (!email || !question) {
      return res.status(400).json({ message: "Email and question are required." });
    }
  
    try {
      const newQuery = new Query({
        email,
        question,
      });
  
      await newQuery.save();
      return res.status(201).json({ message: "Query submitted successfully", query: newQuery });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
  };
  
  const answerQuery = async (req, res) => {
    const { answer, userId } = req.body;
    const { queryId } = req.params; 

    if (!queryId || !answer || !userId) {
        return res.status(400).json({ message: "Query ID, answer, and user ID are required." });
    }

    try {
        const query = await Query.findOne({ queryId });

        if (!query) {
            return res.status(404).json({ message: "Query not found." });
        }

        query.answer = answer;
        query.answerDate = new Date();
        query.userId = userId;
        query.updatedAt = new Date();

        await query.save();

        await sendAnswerEmail(query.email, queryId, query.question, answer);

        return res.status(200).send();
    } catch (error) {
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

const deleteQuery = async (req, res) => {
  try {
      const { queryId } = req.params;
      const deletedQuery = await Query.findOneAndDelete({ queryId });

      if (!deletedQuery) {
          return res.status(404).json({ message: "Query not found" });
      }

      res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
      console.error("Error deleting query:", error);
      res.status(500).json({ message: "Server error" });
  }
  };
module.exports = { getAllQueries, submitQuery, answerQuery, deleteQuery };
