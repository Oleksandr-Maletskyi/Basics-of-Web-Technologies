// ============================================================
// Завдання 2 — Калькулятор успішності
// ============================================================
// Реалізуйте 5 функцій. Перевірте у Console (відкрийте grades.html).
// ============================================================

const grades = [78, 92, 45, 88, 67, 39, 95, 71, 82, 58, 90, 64];

/**
 * Повертає середній бал, округлений до 1 знаку після коми.
 * average([5, 10, 15]) // 10.0
 */
function average(grades) {
    let sum = 0;
    for(let i = 0; i < grades.length; i++){
        sum += grades[i];
    }
    result = sum / grades.length;
    let rounded = Number(result.toFixed(1));
    return rounded
}

/**
 * Повертає найвищу оцінку.
 * Обмеження: НЕ використовувати Math.max(...grades) напряму.
 */
function highest(grades) {
    let max = grades[0];
    for(let i = 0; i < grades.length; i++){
        if(grades[i] > max) max = grades[i];
    }
    return max
}

/**
 * Повертає найнижчу оцінку.
 * Обмеження: НЕ використовувати Math.min(...grades) напряму.
 */
function lowest(grades) {
    let min = grades[0];
    for(let i = 0; i < grades.length; i++){
        if(grades[i] < min) min = grades[i];
    }
    return min
}

/**
 * Повертає відсоток оцінок >= threshold.
 * passRate([60, 50, 70], 60) // 66.7
 */
function passRate(grades, threshold = 60) {
    let pass = 0
    let all = 0
    for(all = 0; all < grades.length; all++){
        if(grades[all] > threshold) pass++;
    }
    let result = pass/all*100;
    return result;
}

/**
 * Повертає об'єкт з кількістю оцінок у діапазонах:
 * { "<60": 2, "60-69": 2, "70-79": 2, "80-89": 3, "90-100": 3 }
 */
function distribution(grades) {
    let a = 0;
    let b = 0;
    let c = 0;
    let d = 0;
    let e = 0;
    
    for(let i = 0; i < grades.length; i++){
        if(grades[i] < 60) e++;
        if(grades[i] >= 60 && grades[i] < 70) d++;
        if(grades[i] >= 70 && grades[i] < 80) c++;
        if(grades[i] >= 80 && grades[i] < 90) b++;
        if(grades[i] >= 90 && grades[i] <= 100) a++;
    }

    gradesObject = {
    "<60": e,
    "60-69": d,
    "70-79": c,
    "80-89": b,
    "90-100": a,
    };
    
    return gradesObject;
}

// ============================================================
// Тестування — розкоментуйте після реалізації
// ============================================================
 console.log("Середнє:    ", average(grades));
 console.log("Найвища:    ", highest(grades));
 console.log("Найнижча:   ", lowest(grades));
 console.log("Pass rate:  ", passRate(grades), "%");
console.log("Distribution:", distribution(grades));