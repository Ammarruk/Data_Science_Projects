#  Student Performance Analysis Report

##  Project Overview
This project analyzes the performance of 1000 students based on demographics, education, and preparation. We performed data cleaning, EDA, statistical testing, and predictive modeling to extract insights.

---

## 1.  Data Cleaning & Preprocessing
- Handled 642 missing values in `test preparation course` by replacing them with `'none'`
- Outliers were retained as real low-performing students
- New features: `total_score`, `average_score`
- Used one-hot encoding for categorical columns

---

## 2. Exploratory Data Analysis
- **Gender**: Females scored higher in reading/writing, males in math
- **Race/Ethnicity**: Group E had highest scores; Group A had the lowest
- **Parental Education**: Higher levels linked to better scores
- **Lunch Type**: Standard lunch students performed better
- **Test Preparation**: Completion led to better scores

---

## 3.  Statistical Analysis
- ANOVA tests showed significant differences based on all five factors
- Reading and writing scores were strongly correlated (0.87)
- Math had moderate correlation with others

---

## 4.  Predictive Modeling

###  Regression
- **Model**: Linear Regression
- **Target**: Math Score
- **R² Score**: 0.73
- **RMSE**: 6.2

###  Classification
- **Model**: Random Forest
- **Target**: Above-Average Student
- **Accuracy**: 85%
- **Top Features**: Test Prep, Parental Education, Lunch

---

## 5.  Recommendations
- Promote test prep courses
- Standardize lunch programs
- Support low-performing demographic groups

---

##  Attachments
- `StudentPerfomance.csv`
- `notebooks/` folder with 4 notebooks
- This `Final_Report.md`

---

> Prepared by: Mohammed Ammar Ruknuddin
> Date: July 2025  
