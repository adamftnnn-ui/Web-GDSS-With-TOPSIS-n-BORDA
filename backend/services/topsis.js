function topsisJS(data) {
    const alternatives = data.alternatif;
    const benefit = data.kriteria.map(k => k.item); // Benefit / Cost
    const weights = data.bobot.map(Number);
    const X = data.nilai.map(row => row.map(Number)); // Matriks nilai
  
    const rows = X.length;
    const cols = X[0].length;
  
    // ❗ Cek semua nilai = 0 (error yang sama seperti Python)
    let allZero = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (X[r][c] !== 0) {
          allZero = false;
          break;
        }
      }
    }
    if (allZero) {
      return {
        status: "error",
        message: "Semua nilai kriteria bernilai 0. TOPSIS tidak dapat dihitung sebelum ada penilaian minimal 1 nilai."
      };
    }
  
    // ▶ 1. Hitung pembagi (sqrt Σ x²)
    const divisors = Array(cols).fill(0);
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      for (let r = 0; r < rows; r++) {
        sum += X[r][c] ** 2;
      }
      divisors[c] = Math.sqrt(sum);
    }
  
    // ▶ 2. Matriks ternormalisasi R
    const R = X.map(row =>
      row.map((v, j) => v / divisors[j])
    );
  
    // ▶ 3. Matriks terbobot Y
    const Y = R.map(row =>
      row.map((v, j) => v * weights[j])
    );
  
    // ▶ 4. Tentukan indeks benefit & cost
    const benefit_cols = [];
    const cost_cols = [];
  
    benefit.forEach((t, i) => {
      if (t === "Benefit") benefit_cols.push(i);
      else cost_cols.push(i);
    });
  
    // ▶ 5. Solusi ideal positif A+
    const A_plus = Array(cols).fill(0);
    const A_minus = Array(cols).fill(0);
  
    for (let j = 0; j < cols; j++) {
      const colValues = Y.map(row => row[j]);
  
      if (benefit_cols.includes(j)) {
        A_plus[j] = Math.max(...colValues);
        A_minus[j] = Math.min(...colValues);
      } else {
        A_plus[j] = Math.min(...colValues);
        A_minus[j] = Math.max(...colValues);
      }
    }
  
    // ▶ 6. Hitung D+ (jarak ke solusi ideal positif)
    const D_plus = R.map(row => {
      let sum = 0;
      for (let j = 0; j < cols; j++) {
        sum += (A_plus[j] - row[j]) ** 2;
      }
      return Math.sqrt(sum);
    });
  
    // ▶ 7. Hitung D- (jarak ke solusi ideal negatif)
    const D_minus = R.map(row => {
      let sum = 0;
      for (let j = 0; j < cols; j++) {
        sum += (row[j] - A_minus[j]) ** 2;
      }
      return Math.sqrt(sum);
    });
  
    // ▶ 8. Skor akhir: V = D- / (D- + D+)
    const V = D_minus.map((dmin, i) => dmin / (dmin + D_plus[i]));
  
    // ▶ 9. Ranking sesuai urutan alternatif input (identik Python)
    const ranking = {};
    const sortedDesc = [...V].sort((a, b) => b - a);

    V.forEach((value, i) => {
    ranking[alternatives[i]] = sortedDesc.indexOf(value) + 1;
    });

    // Alternatif terbaik = skor terbesar
    const bestScore = sortedDesc[0];
    const bestIndex = V.indexOf(bestScore);
    const bestAlt = alternatives[bestIndex];

  
    return {
      "Matriks Keputusan Ternormalisasi": R,
      "Matriks Keputusan Ternormalisasi Terbobot": Y,
      "A+": A_plus,
      "A-": A_minus,
      "D+": D_plus,
      "D-": D_minus,
      "Skor Akhir": V,
      "Peringkat": ranking,
      "Alternatif Terbaik": bestAlt,
    };
  }
  
  module.exports = topsisJS;
  