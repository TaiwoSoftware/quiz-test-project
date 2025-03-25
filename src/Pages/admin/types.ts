export interface Question {
    question: string;
    options: string[];
    answer: string;
  }
  
  export interface Assessment {
    id: string;
    title: string;
    description: string;
    questions: Question[];
  }
  
  export interface Participant {
    student_matric: string;
    answers: string;
  }
  
  export interface Answer {
    selected_answer: string;
  }
  
  export interface FormattedAnswer {
    question: string;
    selected_answer: string | null;
  }
  
  export interface Submission {
    assessment_id: string;
    student_matric: string;
    answers: string;
  }