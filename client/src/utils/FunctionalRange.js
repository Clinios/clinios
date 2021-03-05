/*
F=Female
M=Male
*/

export function calculateFunctionalRange(test, gender, age) {
  const range = {};
  if (test === "82947") { /* Glucose */
    range.low = 85.0;
    range.high = 100.0;
    return range;
  }
  if (test === "84550") { /* Uric Acid */
    if (gender === "F") {
      range.low = 3.2;
      range.high = 5.5;
      return range;
    }
    if (gender === "M") {
      range.low = 3.7;
      range.high = 6.0;
      return range;
    }
  }
  if (test === "84520") { /* BUN */
    range.low = 13.0;
    range.high = 18.0;
    return range;
  }
  if (test === "82565") { /* Creatinine */
    range.low = 0.7;
    range.high = 1.1;
    return range;
  }
  if (test === "BUNCR") { /* BUN/Creatinine Ratio */
    range.low = 13.0;
    range.high = 20.0;
    return range;
  }
  if (test === "82565") { /* eGFR */
    range.low = 59.0;
    range.high = 127.0;
    return range;
  }
  if (test === "84295") { /* Sodium */
    range.low = 135.0;
    range.high = 140.0;
    return range;
  }
  if (test === "84132") { /* Potassium */
    range.low = 4.0;
    range.high = 4.5;
    return range;
  }
  if (test === "82435") { /* Chloride */
    range.low = 100.0;
    range.high = 106.0;
    return range;
  }
  if (test === "82374") { /* Carbon Dioxide */
    range.low = 25.0;
    range.high = 30.0;
    return range;
  }
  if (test === "ANIONGAP") { /* Anion Gap */
    range.low = 7.0;
    range.high = 12.0;
    return range;
  }
  if (test === "82310") { /* Calcium */
    range.low = 9.2;
    range.high = 10.1;
    return range;
  }
  if (test === "83735") { /* Magnesium */
    range.low = 2.0;
    range.high = 2.5;
    return range;
  }
  if (test === "84100") { /* Phosphorus */
    range.low = 3.5;
    range.high = 4.0;
    return range;
  }
  if (test === "001073") { /* Protein Total */
    range.low = 6.9;
    range.high = 7.4;
    return range;
  }
  if (test === "82040") { /* Albumin */
    range.low = 4.0;
    range.high = 5.0;
    return range;
  }
  if (test === "Globulin") { /* Globulin */
    range.low = 2.4;
    range.high = 2.8;
    return range;
  }
  if (test === "AGRatio") { /* Albumin/Globulin Ratio */
    range.low = 1.5;
    range.high = 2.0;
    return range;
  }
  if (test === "82247") { /* Bilirubin Total */
    range.low = 0.2;
    range.high = 1.2;
    return range;
  }
  if (test === "84075") { /* Alkaline Phosphatase */
    range.low = 70.0;
    range.high = 90.0;
    return range;
  }
  if (test === "83615") { /* Lactate dehydrogenase */
    range.low = 140.0;
    range.high = 180.0;
    return range;
  }
  if (test === "84450") { /* AST */
    range.low = 10.0;
    range.high = 26.0;
    return range;
  }
  if (test === "84460") { /* ALT */
    range.low = 10.0;
    range.high = 26.0;
    return range;
  }
  if (test === "82977") { /* GGT */
    range.low = 10.0;
    range.high = 26.0;
    return range;
  }
  if (test === "83540") { /* Iron */
    range.low = 85.0;
    range.high = 130.0;
    return range;
  }
  if (test === "82728") { /* Ferritin */
    range.low = 12.5;
    range.high = 150.0;
    return range;
  }
  if (test === "83550") { /* TIBC */
    range.low = 250.0;
    range.high = 350.0;
    return range;
  }
  if (test === "UIBC") { /* UIBC */
    range.low = 155.0;
    range.high = 355.0;
    return range;
  }
  if (test === "TS%") { /* Iron Saturation */
    range.low = 15.0;
    range.high = 45.0;
    return range;
  }
  if (test === "85048") { /* WBC */
    range.low = 5.0;
    range.high = 8.0;
    return range;
  }
  if (test === "85041") { /* RBC */
    if (gender === "F") {
      range.low = 3.9;
      range.high = 4.5;
      return range;
    }
    if (gender === "M") {
      range.low = 4.2;
      range.high = 4.9;
      return range;
    }
  }
  if (test === "85018") { /* Hemoglobin */
    if (gender === "F") {
      range.low = 13.5;
      range.high = 14.5;
      return range;
    }
    if (gender === "M") {
      range.low = 14.0;
      range.high = 15.0;
      return range;
    }
  }
  if (test === "85014") { /* Hematocrit */
    if (gender === "F") {
      range.low = 37.0;
      range.high = 44.0;
      return range;
    }
    if (gender === "M") {
      range.low = 40.0;
      range.high = 48.0;
      return range;
    }
  }

  if (test === "MCV") { /* MCV */
    range.low = 85.0;
    range.high = 92.0;
    return range;
  }
  if (test === "MCH") { /* MCH */
    range.low = 27.0;
    range.high = 32.0;
  }
  if (test === "MCHC") { /* MCHC */
    range.low = 32.0;
    range.high = 35.0;
    return range;
  }
  if (test === "RDW") { /* RDW */
    range.low = 0.0;
    range.high = 13.0;
    return range;
  }
  if (test === "85049") { /* Platelets */
    range.low = 155.0;
    range.high = 385.0;
    return range;
  }
  if (test === "Neut%") { /* Neutrophils % */
    range.low = 40.0;
    range.high = 60.0;
    return range;
  }
  if (test === "Lymph%") { /* Lymphocytes % */
    range.low = 25.0;
    range.high = 40.0;
    return range;
  }
  if (test === "Mono%") { /* Monocytes % */
    range.low = 0.0;
    range.high = 7.0;
    return range;
  }
  if (test === "Eos%") { /* Eosinophil % */
    range.low = 0.0;
    range.high = 3.0;
    return range;
  }
  if (test === "Baso%") { /* Basophil % */
    range.low = 0.0;
    range.high = 1.0;
    return range;
  }
  if (test === "82465") { /* Cholesterol Total */
    range.low = 150.0;
    range.high = 200.0;
    return range;
  }
  if (test === "83718") { /* HDL Cholesterol */
    range.low = 55.0;
    range.high = 120.0;
    return range;
  }
  if (test === "83721") { /* LDL Cholesterol */
    range.low = 50.0;
    range.high = 120.0;
    return range;
  }
  if (test === "VLDL") { /* VLDL Cholesterol */
    range.low = 0.0;
    range.high = 20.0;
    return range;
  }
  if (test === "84478") { /* Triglycerides */
    range.low = 75.0;
    range.high = 100.0;
    return range;
  }
  if (test === "C/HDLR") { /* Cholesterol/HDL Ratio */
    range.low = 0.0;
    range.high = 3.1;
    return range;
  }
  if (test === "84443") { /* TSH */
    range.low = 1.8;
    range.high = 3.0;
    return range;
  }
  if (test === "84480") { /* T3 Total */
    range.low = 1000;
    range.high = 1800;
    return range;
  }
  if (test === "84481") { /* T3 Free */
    range.low = 3.0;
    range.high = 4.0;
    return range;
  }
  if (test === "84436") { /* T4 Total */
    range.low = 6.0;
    range.high = 12.0;
    return range;
  }
  if (test === "84439") { /* T4 Free */
    range.low = 1.0;
    range.high = 1.5;
    return range;
  }
  if (test === "84479") { /* T3 Uptake */
    range.low = 28.0;
    range.high = 38.0;
    return range;
  }
  if (test === "86800") { /* Thyroglobulin Ab */
    range.low = 0.0;
    range.high = 32.0;
    return range;
  }
  if (test === "86376") { /* Thyroid Peroxidase Ab */
    range.low = 0.0;
    range.high = 9.0;
    return range;
  }
  if (test === "84482") { /* T3 Reverse */
    range.low = 9.0;
    range.high = 33.0;
    return range;
  }
  if (test === "FT4I") { /* Free T4 Index (T7) */
    range.low = 1.2;
    range.high = 4.9;
    return range;
  }
  if (test === "83036") { /* A1C */
    range.low = 5.0;
    range.high = 5.5;
    return range;
  }
  if (test === "82306") { /* Vitamin D 25 Hydroxy */
    range.low = 50.0;
    range.high = 100.0;
    return range;
  }
  if (test === "86141") { /* C-Reactive Protein */
    range.low = 0.0;
    range.high = 1.0;
    return range;
  }
  if (test === "83090") { /* Homocysteine */
    range.low = 0.0;
    range.high = 7.0;
    return range;
  }
  if (test === "84255") { /* Selenium */
    range.low = 100.0;
    range.high = 140.0;
    return range;
  }
  if (test === "84681") { /* C‐peptide */
    range.low = 1.2;
    range.high = 2.1;
    return range;
  }
  if (test === "RHR") { /* resting heart rate */
    if (age >= 19 && age <= 25) {
      if (gender === "F") {
        range.low = 54;
        range.high = 78;
        return range;
      }
      if (gender === "M") {
        range.low = 49;
        range.high = 73;
        return range;
      }
    }
    if (age >= 26 && age <= 35) {
      if (gender === "F") {
        range.low = 54;
        range.high = 76;
        return range;
      }
      if (gender === "M") {
        range.low = 49;
        range.high = 74;
        return range;
      }
    }
    if (age >= 36 && age <= 45) {
      if (gender === "F") {
        range.low = 54;
        range.high = 78;
        return range;
      }
      if (gender === "M") {
        range.low = 50;
        range.high = 75;
        return range;
      }
    }
    if (age >= 46 && age <= 55) {
      if (gender === "F") {
        range.low = 54;
        range.high = 77;
        return range;
      }
      if (gender === "M") {
        range.low = 50;
        range.high = 76;
        return range;
      }
    }
    if (age >= 56 && age <= 65) {
      if (gender === "F") {
        range.low = 54;
        range.high = 77;
        return range;
      }
      if (gender === "M") {
        range.low = 51;
        range.high = 75;
        return range;
      }
    }
    if (age >= 65 && age <= 99) {
      if (gender === "F") {
        range.low = 54;
        range.high = 76;
        return range;
      }
      if (gender === "M") {
        range.low = 50;
        range.high = 73;
        return range;
      }
    }
  }
  return true;
}


export function calculateFunctionalPercentage(rangeLow, rangeHigh, lastValue) {
  let percentage = "";
  if (lastValue < rangeLow) {
    const percentValue = Math.abs(Number(((lastValue / rangeLow) * 100) - 100).toFixed(1));
    percentage = `Low ${percentValue}%`;
  }
  if (lastValue > rangeHigh) {
    const percentValue = Math.abs(Number(((lastValue / rangeHigh) * 100) - 100).toFixed(1));
    percentage = `High ${percentValue}%`;
  }
  return percentage;
}
