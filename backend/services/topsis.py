import sys
import json
import pandas as pd
import numpy as np

def topsis(data):
    alternatives = data['alternatif']
    benefit = [x['item'] for x in data['kriteria']]

    weights = np.array(data['bobot'])
    X = np.array(data['nilai'], dtype=float)

    if np.all(X == 0):
        return {
            "status": "error",
            "message": "Semua nilai kriteria bernilai 0. TOPSIS tidak dapat dihitung sebelum ada penilaian minimal 1 nilai."
        }

    divisors = np.sqrt(np.sum(X**2, axis=0))
    R = X / divisors  # Matriks ternormalisasi

    Y = R * weights  # Matriks terbobot

    benefit_cols = [i for i, t in enumerate(benefit) if t == "Benefit"]
    cost_cols = [i for i, t in enumerate(benefit) if t == "Cost"]

    A_plus = np.zeros(Y.shape[1])
    A_plus[benefit_cols] = np.max(Y[:, benefit_cols], axis=0)
    A_plus[cost_cols] = np.min(Y[:, cost_cols], axis=0)

    A_minus = np.zeros(Y.shape[1])
    A_minus[benefit_cols] = np.min(Y[:, benefit_cols], axis=0)
    A_minus[cost_cols] = np.max(Y[:, cost_cols], axis=0)

    D_plus = np.sqrt(np.sum((A_plus - R)**2, axis=1))  # Jarak ke solusi ideal positif
    D_minus = np.sqrt(np.sum((R - A_minus)**2, axis=1))  # Jarak ke solusi ideal negatif

    V = D_minus / (D_minus + D_plus)

    V_series = pd.Series(V, index=alternatives)
    ranking = V_series.rank(method='first', ascending=False).astype(int)

    return {
        "Matriks Keputusan Ternormalisasi": R.tolist(),
        "Matriks Keputusan Ternormalisasi Terbobot": Y.tolist(),
        "D+":D_plus.tolist(),
        "D-":D_minus.tolist(),
        "Skor Akhir": V.tolist(),
        "Peringkat": ranking.to_dict(),
        "Alternatif Terbaik": ranking.idxmin()
    }

# Membaca input dari stdin
input_data = sys.stdin.read()
data = json.loads(input_data)  # Mengonversi JSON string menjadi Python dict

# Memanggil fungsi topsis dan mendapatkan hasil
result = topsis(data)

# Mengirimkan hasil kembali ke stdout dalam format JSON
print(json.dumps(result))
