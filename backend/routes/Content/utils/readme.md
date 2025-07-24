# LMS Backend API

A complete REST API for managing **Courses**, **Chapters**, **Topics** (with WYSIWYG content), and **Quizzes** (with question image support) in your Learning Management System.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [Course](#course)
  - [Chapter](#chapter)
  - [Topic](#topic)
  - [Quiz](#quiz)
- [Data Models](#data-models)
  - [Course Schema](#course-schema)
  - [Chapter Schema](#chapter-schema)
  - [Topic Schema](#topic-schema)
  - [Quiz Schema](#quiz-schema)
- [Example Requests & Responses](#example-requests--responses)
- [Notes](#notes)

---

## API Endpoints

### Course

| Method | Endpoint         | Body Type           | Description                          |
| ------ | ---------------- | ------------------- | ------------------------------------ |
| GET    | /api/courses     | —                   | List all courses                     |
| POST   | /api/courses     | multipart/form-data | Create course (image: field `image`) |
| GET    | /api/courses/:id | —                   | Get course by ID                     |
| PUT    | /api/courses/:id | multipart/form-data | Update course (image optional)       |
| DELETE | /api/courses/:id | —                   | Delete course                        |

**Course Fields (request & response):**

- `category`: string, required. E.g., `"Mathematics"`
- `title`: string, required. Course name.
- `price`: number, required. Course fee.
- `level`: string, optional. E.g., `"Beginner"`, `"Intermediate"`
- `discount`: number, optional. Defaults to 0.
- `status`: string, optional. E.g., `"active"` or `"inactive"`
- `description`: string, optional. Short description.
- `image`: string, optional. Auto-filled if uploaded.
- `chapters`: array of Chapter IDs, auto-generated.

---

### Chapter

| Method | Endpoint                          | Body Type | Description                |
| ------ | --------------------------------- | --------- | -------------------------- |
| GET    | /api/chapters/by-course/:courseId | —         | List chapters for a course |
| POST   | /api/chapters/by-course/:courseId | JSON      | Add chapter to a course    |
| GET    | /api/chapters/:id                 | —         | Get chapter by ID          |
| PUT    | /api/chapters/:id                 | JSON      | Update chapter             |
| DELETE | /api/chapters/:id                 | —         | Delete chapter             |

**Chapter Fields:**

- `title`: string, required. Name of chapter.
- `slug`: string, optional. URL-friendly.
- `status`: string, optional. `"active"`/`"inactive"`.
- `topics`: array of Topic IDs.

---

### Topic

| Method | Endpoint                          | Body Type | Description            |
| ------ | --------------------------------- | --------- | ---------------------- |
| GET    | /api/topics/by-chapter/:chapterId | —         | List topics in chapter |
| POST   | /api/topics/by-chapter/:chapterId | JSON      | Add topic to a chapter |
| GET    | /api/topics/:id                   | —         | Get topic by ID        |
| PUT    | /api/topics/:id                   | JSON      | Update topic           |
| DELETE | /api/topics/:id                   | —         | Delete topic           |

**Topic Fields:**

- `title`: string, required. Name of topic.
- `content`: string, required. WYSIWYG HTML (can have base64/URL images, video embeds).
- `status`: string, optional. `"active"`/`"inactive"`.
- `quiz`: Quiz ID (ObjectId), optional. Reference to the topic's quiz.

---

### Quiz

| Method | Endpoint                         | Body Type           | Description                                    |
| ------ | -------------------------------- | ------------------- | ---------------------------------------------- |
| POST   | /api/quizzes                     | JSON                | Create quiz for a topic (with questions array) |
| GET    | /api/quizzes/:id                 | —                   | Get quiz by ID (all questions)                 |
| PUT    | /api/quizzes/:id                 | JSON                | Update quiz                                    |
| DELETE | /api/quizzes/:id                 | —                   | Delete quiz                                    |
| GET    | /api/quizzes/random?topicId=xxxx | —                   | Get 5 random questions for a topic's quiz      |
| POST   | /api/quizzes/upload-image        | multipart/form-data | Upload image for quiz question (`image` field) |

**Quiz Fields:**

- `topic`: string (ObjectId). The topic this quiz belongs to.
- `questions`: array of question objects. Each question:
  - `question`: string, required.
  - `image`: string, optional. (Image URL, from upload endpoint)
  - `options`: array of strings, required. Choices for MCQ.
  - `answer`: string, required. Correct answer.

---

## Data Models
