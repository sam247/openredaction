/**
 * Education Industry PII Patterns
 * For schools, universities, educational institutions - FERPA compliance
 */

import { PIIPattern } from '../../types';

/**
 * Student ID Numbers
 */
export const STUDENT_ID: PIIPattern = {
  type: 'STUDENT_ID',
  regex: /\b(?:STUDENT|PUPIL|SCHOLAR)[-\s]?(?:ID|NUM(?:BER)?|NO)?[-\s]?[:#]?\s*([A-Z]{0,2}\d{6,10})\b/gi,
  placeholder: '[STUDENT_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Student identification numbers'
};

/**
 * University/College ID
 */
export const UNIVERSITY_ID: PIIPattern = {
  type: 'UNIVERSITY_ID',
  regex: /\b(?:UNIVERSITY|COLLEGE|UNI)[-\s]?(?:ID|NUM(?:BER)?|NO)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[UNI_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'University and college ID numbers',
  validator: (_value: string, context: string) => {
    return /university|college|campus|student|enrollment|registr/i.test(context);
  }
};

/**
 * Course Numbers/Codes
 */
export const COURSE_CODE: PIIPattern = {
  type: 'COURSE_CODE',
  regex: /\b([A-Z]{2,4}\s?\d{3,4}[A-Z]?)\b/g,
  placeholder: '[COURSE_{n}]',
  priority: 60,
  severity: 'low',
  description: 'Course codes and numbers',
  validator: (value: string, context: string) => {
    // Only in academic context
    const academicContext = /course|class|section|semester|quarter|curriculum|syllabus/i.test(context);
    // Format check: letters followed by numbers
    const validFormat = /^[A-Z]{2,4}\s?\d{3,4}[A-Z]?$/.test(value);
    return academicContext && validFormat;
  }
};

/**
 * Grade/GPA References (when explicit)
 */
export const GRADE_REFERENCE: PIIPattern = {
  type: 'GRADE_REFERENCE',
  regex: /\b(?:GPA|GRADE[-\s]?POINT[-\s]?AVERAGE)[-\s]?[:#]?\s*((?:[0-4]\.\d{1,2})|(?:\d\.\d{2}))\b/gi,
  placeholder: '[GPA_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Grade Point Average (GPA) references'
};

/**
 * Transcript ID Numbers
 */
export const TRANSCRIPT_ID: PIIPattern = {
  type: 'TRANSCRIPT_ID',
  regex: /\b(?:TRANSCRIPT)[-\s]?(?:ID|NUM(?:BER)?|NO|REF)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[TRANSCRIPT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Academic transcript identifiers'
};

/**
 * Library Card Numbers
 */
export const LIBRARY_CARD: PIIPattern = {
  type: 'LIBRARY_CARD',
  regex: /\b(?:LIBRARY)[-\s]?(?:CARD|ID|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[LIBRARY_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Library card numbers'
};

/**
 * Teacher/Faculty ID
 */
export const FACULTY_ID: PIIPattern = {
  type: 'FACULTY_ID',
  regex: /\b(?:FACULTY|TEACHER|INSTRUCTOR|PROFESSOR|STAFF)[-\s]?(?:ID|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z]{1,2}\d{6,10})\b/gi,
  placeholder: '[FACULTY_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Faculty and teacher identification numbers',
  validator: (_value: string, context: string) => {
    return /faculty|teacher|instructor|professor|staff|employee|personnel/i.test(context);
  }
};

/**
 * Enrollment Numbers
 */
export const ENROLLMENT_NUMBER: PIIPattern = {
  type: 'ENROLLMENT_NUMBER',
  regex: /\b(?:ENROLLMENT|REGISTRATION)[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[ENROLLMENT_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Course enrollment and registration numbers'
};

/**
 * Financial Aid ID
 */
export const FINANCIAL_AID_ID: PIIPattern = {
  type: 'FINANCIAL_AID_ID',
  regex: /\b(?:FINANCIAL[-\s]?AID|FAFSA|AID[-\s]?APPLICATION)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[AID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Financial aid and FAFSA identifiers'
};

/**
 * Degree/Certificate Numbers
 */
export const DEGREE_NUMBER: PIIPattern = {
  type: 'DEGREE_NUMBER',
  regex: /\b(?:DEGREE|DIPLOMA|CERTIFICATE)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[DEGREE_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Degree and certificate numbers',
  validator: (_value: string, context: string) => {
    return /degree|diploma|certificate|graduation|credential/i.test(context);
  }
};

/**
 * Exam/Test ID Numbers
 */
export const EXAM_ID: PIIPattern = {
  type: 'EXAM_ID',
  regex: /\b(?:EXAM|TEST|QUIZ|ASSESSMENT)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[EXAM_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Examination and test identifiers',
  validator: (_value: string, context: string) => {
    return /exam|test|quiz|assessment|midterm|final|score/i.test(context);
  }
};

/**
 * Exam Registration Numbers (standardized format)
 */
export const EXAM_REGISTRATION_NUMBER: PIIPattern = {
  type: 'EXAM_REGISTRATION_NUMBER',
  regex: /\bEXAM[-\s]?(\d{4}[-]\d{4})\b/gi,
  placeholder: '[EXAM_REG_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Exam registration numbers (standardized format)'
};

/**
 * Dorm/Housing Assignment
 */
export const HOUSING_ASSIGNMENT: PIIPattern = {
  type: 'HOUSING_ASSIGNMENT',
  regex: /\b(?:DORM|ROOM|HOUSING)[-\s]?(?:NO|NUM(?:BER)?|ASSIGNMENT)?[-\s]?[:#]?\s*([A-Z0-9]{4,10})\b/gi,
  placeholder: '[HOUSING_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Dormitory and housing assignments',
  validator: (_value: string, context: string) => {
    return /dorm|housing|residence|room|building|floor|suite/i.test(context);
  }
};

/**
 * Meal Plan ID
 */
export const MEAL_PLAN_ID: PIIPattern = {
  type: 'MEAL_PLAN_ID',
  regex: /\b(?:MEAL[-\s]?PLAN|DINING)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[MEAL_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Meal plan and dining identifiers'
};

/**
 * Parking Permit Numbers
 */
export const PARKING_PERMIT: PIIPattern = {
  type: 'PARKING_PERMIT',
  regex: /\b(?:PARKING)[-\s]?(?:PERMIT|PASS|DECAL)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[PARKING_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Parking permit numbers'
};

/**
 * Scholarship ID Numbers
 */
export const SCHOLARSHIP_ID: PIIPattern = {
  type: 'SCHOLARSHIP_ID',
  regex: /\b(?:SCHOLARSHIP|GRANT|AWARD)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[SCHOLARSHIP_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Scholarship and grant award numbers',
  validator: (_value: string, context: string) => {
    return /scholarship|grant|award|fellowship|stipend|financial/i.test(context);
  }
};

/**
 * Graduation Year (when combined with other PII)
 */
export const GRADUATION_YEAR: PIIPattern = {
  type: 'GRADUATION_YEAR',
  regex: /\b(?:CLASS[-\s]?OF|GRADUATING[-\s]?CLASS|GRAD(?:UATION)?[-\s]?YEAR)[-\s]?[:#]?\s*(['']?\d{2}|[12]\d{3})\b/gi,
  placeholder: '[GRAD_YEAR_{n}]',
  priority: 65,
  severity: 'low',
  description: 'Graduation year references'
};

/**
 * Application ID (admissions)
 */
export const APPLICATION_ID: PIIPattern = {
  type: 'APPLICATION_ID',
  regex: /\b(?:APPLICATION|ADMISSION|APPLICANT)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[APPLICATION_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Admissions application identifiers',
  validator: (_value: string, context: string) => {
    return /application|admission|applicant|prospective|admit|enroll/i.test(context);
  }
};

/**
 * Alumni ID Numbers
 */
export const ALUMNI_ID: PIIPattern = {
  type: 'ALUMNI_ID',
  regex: /\b(?:ALUMNI|ALUMNUS|ALUMNA)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[ALUMNI_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Alumni identification numbers'
};

/**
 * Research Grant Numbers
 */
export const RESEARCH_GRANT: PIIPattern = {
  type: 'RESEARCH_GRANT',
  regex: /\b(?:GRANT|RESEARCH|FUNDING)[-\s]?(?:NO|NUM(?:BER)?|ID|REF)?[-\s]?[:#]?\s*([A-Z]{2,4}[-]?\d{6,10})\b/gi,
  placeholder: '[GRANT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Research grant and funding numbers',
  validator: (_value: string, context: string) => {
    return /grant|research|funding|nsf|nih|award|project/i.test(context);
  }
};

/**
 * Department Codes
 */
export const DEPARTMENT_CODE: PIIPattern = {
  type: 'DEPARTMENT_CODE',
  regex: /\b(?:DEPT|DEPARTMENT)[-\s]?(?:CODE)?[-\s]?[:#]?\s*([A-Z]{3,6})\b/g,
  placeholder: '[DEPT_{n}]',
  priority: 55,
  severity: 'low',
  description: 'Academic department codes',
  validator: (value: string, context: string) => {
    const academicContext = /department|college|school|faculty|division/i.test(context);
    const minLength = value.length >= 3;
    return academicContext && minLength;
  }
};

// Export all education patterns
export const educationPatterns: PIIPattern[] = [
  STUDENT_ID,
  UNIVERSITY_ID,
  COURSE_CODE,
  GRADE_REFERENCE,
  TRANSCRIPT_ID,
  LIBRARY_CARD,
  FACULTY_ID,
  ENROLLMENT_NUMBER,
  FINANCIAL_AID_ID,
  DEGREE_NUMBER,
  EXAM_ID,
  EXAM_REGISTRATION_NUMBER,
  HOUSING_ASSIGNMENT,
  MEAL_PLAN_ID,
  PARKING_PERMIT,
  SCHOLARSHIP_ID,
  GRADUATION_YEAR,
  APPLICATION_ID,
  ALUMNI_ID,
  RESEARCH_GRANT,
  DEPARTMENT_CODE
];
