/**
 * Semester Data Configuration
 * 
 * This file contains all the subject data for different semesters.
 * To add/edit subjects, simply modify the subjects array for each semester.
 * 
 * Each subject should have:
 * - name: The subject name
 * - credit: Default credit (1-5)
 * - defaultGrade: Default grade ('F' is recommended)
 */

export const gradePoints = {
  'S': 10,
  'A+': 9,
  'A': 8.5,
  'B+': 8,
  'B': 7.5,
  'C+': 7,
  'C': 6.5,
  'D': 6,
  'P': 5.5,
  'F': 0
};

export const grades = ['S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'P', 'F'];
export const credits = [1, 2, 3, 4, 5];

export const semesterData = {
  1: {
    name: "Semester 1",
    subjects: [
      { name: "Discrete Mathematics", credit: 4, defaultGrade: 'F' },
      { name: "Engineering Chemistry and Advanced Materials", credit: 4, defaultGrade: 'F' },
      { name: "Python for Engineers", credit: 3, defaultGrade: 'F' },
      { name: "Introduction to Computing Essentials", credit: 4, defaultGrade: 'F' },
      { name: "Basics of Electrical and Electronics Engineering", credit: 4, defaultGrade: 'F' },
      { name: "Technical English and Soft Skills", credit: 3, defaultGrade: 'F' }
    ]
  },
  2: {
    name: "Semester 2",
    subjects: [
      { name: "Linear Algebra and Probability", credit: 4, defaultGrade: 'F' },
      { name: "Fundamentals of Engineering Physics", credit: 4, defaultGrade: 'F' },
      { name: "Essential foundations of Digital Logic", credit: 4, defaultGrade: 'F' },
      { name: "Computer Programming in C & Shell Scripting", credit: 4, defaultGrade: 'F' },
      { name: "Computer Hardware Essentials", credit: 3, defaultGrade: 'F' },
      { name: "Engineering Economics", credit: 3, defaultGrade: 'F' }
    ]
  },
  3: {
    name: "Semester 3",
    subjects: [
      { name: "Number Theory, Transforms and Queueing Theory", credit: 4, defaultGrade: 'F' },
      { name: "Data Structures and Algorithms", credit: 4, defaultGrade: 'F' },
      { name: "Object Oriented Programming", credit: 4, defaultGrade: 'F' },
      { name: "Computer Organization and Architecture", credit: 4, defaultGrade: 'F' },
      { name: "Universal Human Values", credit: 2, defaultGrade: 'F' },
      { name: "Essentials of Office Automation", credit: 0, defaultGrade: 'F' },
      { name: "Data Structures Lab", credit: 2, defaultGrade: 'F' },
      { name: "Object Oriented Programming Lab", credit: 2, defaultGrade: 'F' }
    ]
  }
};

// Helper function to get subjects for a semester
export const getSubjects = (semesterNumber) => {
  return semesterData[semesterNumber]?.subjects || [];
};

// Helper function to get all semester numbers
export const getAllSemesters = () => {
  return Object.keys(semesterData).map(Number);
};
