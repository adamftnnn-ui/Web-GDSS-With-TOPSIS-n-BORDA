function hitungBorda(data) {
    const jumlahAlternatif = Object.keys(data[0].peringkat).length;

    const bobot = {};
    for (let i = 1; i <= jumlahAlternatif; i++) {
        bobot[i] = jumlahAlternatif - (i - 1);
    }

    const alternatif = Object.keys(data[0].peringkat);

    const ranking_view = data.map(item => ({
        [item.nama]: { ...item.peringkat }
    }));

    const ranking_on_criteria = alternatif.map(alt => {
        const value = data.map(item => item.peringkat[alt]);
        return { [alt]: value };
    });

    // ✔ FIX: Jaga urutan skor_akhir sesuai urutan alternatif input
    const skor_akhir_on_criteria = data.map(item =>
        alternatif.map(alt => {
            const idx = alternatif.indexOf(alt);
            return item.skor_akhir[idx];
        })
    );

    const bobot_from_ranking = ranking_on_criteria.map(obj => {
        const key = Object.keys(obj)[0];
        return obj[key].map(rankVal => bobot[rankVal]);
    });

    const skor = bobot_from_ranking.map((arrBobot, idxAlt) =>
        arrBobot.map((b, idxDM) => b * skor_akhir_on_criteria[idxDM][idxAlt])
    );

    const skor_akhir = skor.map(x => x.reduce((a, b) => a + b, 0));

    const ranking_plain = skor_akhir
        .map((v, i) => ({ idx: i, val: v }))
        .sort((a, b) => b.val - a.val);

    const ranking = ranking_plain.map((obj, i) => ({
        [alternatif[obj.idx]]: {
            skor_akhir: obj.val,
            ranking: i + 1
        }
    }));

    // ✔ FIX: pastikan kembali JSON biasa, bukan Mongoose doc
    return JSON.parse(JSON.stringify({
        ranking_alternatif_per_decision_maker: ranking_view,
        perhitungan_skor_borda: ranking
    }));
}

module.exports = { hitungBorda };
