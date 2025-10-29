import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface UniversityCourse {
  _id?: string;
  slug: string;
  name: string;
  category: "UG Programs" | "PG Programs" | "Ph.D Programs";
  about: string;
  description: string;
  eligibility: string[];
  highlights: string[];
  duration?: string;
  careerProspects: string[];
  contactSection?: {
    phone: string;
    email: string;
    address: string;
    showForm: boolean;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  isActive?: boolean;
}

/**
 * Fetch all university courses from the API
 */
export async function getAllUniversityCourses(): Promise<UniversityCourse[]> {
  try {
    const response = await axios.get(`${API_BASE}/university-courses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university courses:", error);
    throw error;
  }
}

/**
 * Fetch a single university course by slug
 */
export async function getUniversityCourseBySlug(
  slug: string
): Promise<UniversityCourse | null> {
  try {
    const response = await axios.get(`${API_BASE}/university-courses/${slug}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching university course:", error);
    throw error;
  }
}

/**
 * Get all course slugs for static generation
 */
export async function getAllCourseSlugs(): Promise<string[]> {
  try {
    const courses = await getAllUniversityCourses();
    return courses.map((course) => course.slug);
  } catch (error) {
    console.error("Error fetching course slugs:", error);
    return [];
  }
}
