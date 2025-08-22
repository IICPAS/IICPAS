# Quiz Upload Guide

## Overview
This guide explains how to upload quiz questions using Excel files in the admin dashboard.

## Excel Format Requirements

### Required Columns
Your Excel file must have the following columns (case-insensitive):

| Column Name | Description | Required | Example |
|-------------|-------------|----------|---------|
| **question** | The question text | Yes | "What is the capital of France?" |
| **option1** | First option | Yes | "London" |
| **option2** | Second option | Yes | "Paris" |
| **option3** | Third option | Yes | "Berlin" |
| **option4** | Fourth option | Yes | "Madrid" |
| **answer** | Correct answer (must match one of the options exactly) | Yes | "Paris" |

### Accepted Column Names
The system accepts both lowercase and uppercase column names:
- `question` or `Question`
- `option1` or `Option1`
- `option2` or `Option2`
- `option3` or `Option3`
- `option4` or `Option4`
- `answer` or `Answer`

## Example Excel Content

| question | option1 | option2 | option3 | option4 | answer |
|----------|---------|---------|---------|---------|--------|
| What is 2 + 2? | 3 | 4 | 5 | 6 | 4 |
| Which planet is closest to the Sun? | Venus | Earth | Mars | Mercury | Mercury |
| What is the largest ocean? | Atlantic | Indian | Arctic | Pacific | Pacific |

## Important Rules

### 1. Answer Validation
- The `answer` must exactly match one of the option values (case-sensitive)
- If the answer doesn't match any option, the row will be rejected

### 2. Minimum Requirements
- At least 2 options are required per question
- Question text cannot be empty
- Answer cannot be empty

### 3. File Format
- Supports both `.xls` and `.xlsx` files
- First sheet will be used for parsing

### 4. Empty Options
- If you have fewer than 4 options, leave unused option columns empty
- Empty options will be automatically filtered out

## How to Use

### Step 1: Download Template
1. Click the "📥 Download Excel Template" button
2. This will download a sample file with the correct format

### Step 2: Prepare Your Quiz
1. Open the downloaded template or create a new Excel file
2. Add your questions following the format
3. Ensure all answers match one of the options exactly

### Step 3: Upload Quiz
1. Click "Upload Quiz (Excel)" button
2. Select your Excel file
3. The system will validate and parse your questions
4. Review the preview to ensure everything is correct

### Step 4: Save Topic
1. Fill in the topic title and content
2. Click "Add Topic" to save both the topic and quiz

## Validation Features

The system automatically validates:
- ✅ Required fields are not empty
- ✅ At least 2 options per question
- ✅ Answer matches one of the options
- ✅ File format is valid
- ✅ Data can be parsed successfully

## Error Handling

If there are validation errors:
- The system will show specific error messages
- Invalid rows will be skipped
- Valid questions will still be processed
- You can fix the errors and re-upload

## Preview Feature

After uploading:
- Click "Preview Quiz" to see all loaded questions
- Review questions, options, and correct answers
- Ensure everything looks correct before saving

## Backend Integration

The quiz data is automatically:
1. Parsed from Excel format
2. Validated for correctness
3. Saved to the database with the topic
4. Linked to the topic for student access

## Troubleshooting

### Common Issues:
1. **"Answer must match one of the options"** - Check spelling and case sensitivity
2. **"At least 2 options required"** - Make sure you have at least 2 non-empty options
3. **"Question is required"** - Ensure question column is not empty
4. **"Failed to parse Excel file"** - Check file format and ensure it's not corrupted

### Tips:
- Use the template as a starting point
- Double-check answer spelling and case
- Test with a small file first
- Keep questions clear and concise
