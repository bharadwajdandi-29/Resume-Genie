import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Helper to randomize sentence parts
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

app.post("/generate-objective", (req, res) => {
  const { skills, role } = req.body;

  if (!skills || !role) {
    return res.status(400).json({ error: "Missing skills or role" });
  }

  const strengths = [
    "results-driven",
    "highly motivated",
    "detail-oriented",
    "innovative",
    "performance-focused",
    "adaptable",
  ];

  const goals = [
    "seeking to contribute to impactful projects",
    "eager to drive business growth through technology",
    "passionate about delivering scalable solutions",
    "focused on continuous learning and innovation",
    "committed to improving system efficiency",
  ];

  const contributions = [
    "strong problem-solving abilities",
    "technical excellence",
    "collaborative teamwork skills",
    "analytical thinking",
    "efficient development practices",
  ];

  const selectedStrength = randomItem(strengths);
  const selectedGoal = randomItem(goals);
  const selectedContribution = randomItem(contributions);

  const generatedObjective = `
${selectedStrength.charAt(0).toUpperCase() + selectedStrength.slice(1)} ${role} with expertise in ${skills}. 
Bringing ${selectedContribution} and a proactive mindset to every project. 
${selectedGoal}, while leveraging technical knowledge to deliver measurable results 
and contribute effectively to organizational success.
`.replace(/\s+/g, " ").trim();

  res.json({ result: generatedObjective });
});

app.listen(5000, () => {
  console.log("Smart AI Server running on http://localhost:5000");
});