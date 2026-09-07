export const SKILL_VOCAB = [
  "Python","SQL","Statistics","Data Visualization","Machine Learning",
  "Financial Modeling","Market Research","Project Management","Public Speaking",
  "Writing","UX Research","Prototyping","Software Development","Algorithms",
  "Business Strategy","Accounting","Economics","Marketing","Excel","Communication",
  "Systems Design","Negotiation","Data Structures","A/B Testing","Forecasting"
];

export const ROLE_MAP: Record<string, string[]> = {
  "Data Analyst": ["Python","SQL","Statistics","Data Visualization","Excel"],
  "Data Scientist": ["Python","Statistics","Machine Learning","Algorithms","Data Structures"],
  "Software Engineer": ["Software Development","Algorithms","Data Structures","Systems Design","Python"],
  "Product Manager": ["Market Research","Project Management","Public Speaking","Business Strategy","A/B Testing","UX Research"],
  "Consultant": ["Business Strategy","Public Speaking","Writing","Economics","Communication","Negotiation"],
  "Financial Analyst": ["Financial Modeling","Accounting","Economics","Excel","Forecasting"],
  "Marketing Analyst": ["Market Research","Marketing","Data Visualization","Communication","A/B Testing"],
  "UX Designer": ["UX Research","Prototyping","Communication","Data Visualization"],
  "Project Manager": ["Project Management","Communication","Negotiation","Business Strategy"]
};
