// Course Level Constants
export const DEFAULT_LEVELS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
  { value: "Expert", label: "Expert" },
  { value: "Executive Level", label: "Executive Level" },
  { value: "Professional Level", label: "Professional Level" },
  { value: "Digital Hub+Center", label: "Digital Hub+Center" },
];

// Function to get course levels from API or use defaults
export const getCourseLevels = async () => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
    const response = await fetch(`${API_BASE}/course-levels`);
    if (response.ok) {
      const data = await response.json();
      return data.length > 0 ? data : DEFAULT_LEVELS;
    }
  } catch (error) {
    console.log("Using default course levels");
  }
  return DEFAULT_LEVELS;
};
