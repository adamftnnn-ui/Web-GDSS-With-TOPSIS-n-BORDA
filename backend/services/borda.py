import sys
import json

# data=[
#     {
#         "nama":"dm1",
#         "skor_akhir": [
#             0.5,
#             0.5,
#             0.5,
#             0.5,
#             0.5
#         ],
#         "peringkat": {
#             "Sop Saudara Irian": 1,
#             "Coto Maros": 2,
#             "Coto Nusantara": 3,
#             "Pallubasa Serigala": 4,
#             "Mie Titi Panakkukang": 5
#         } 
#     },
#     {
#         "nama":"dm2",
#         "skor_akhir": [
#             0.4069635232152323,
#             0.3661957998350068,
#             0.39327685683347563,
#             0.40944434124898843,
#             0.4034937327649982
#         ],
#         "peringkat": {
#             "Sop Saudara Irian": 2,
#             "Coto Maros": 5,
#             "Coto Nusantara": 4,
#             "Pallubasa Serigala": 1,
#             "Mie Titi Panakkukang": 3
#         },
#     },
#     {
#         "nama":"dm3",
#         "skor_akhir": [
#             0.7,
#             0.6,
#             0.6,
#             0.5,
#             0.5
#         ],
#         "peringkat": {
#             "Sop Saudara Irian": 1,
#             "Coto Maros": 2,
#             "Coto Nusantara": 3,
#             "Pallubasa Serigala": 4,
#             "Mie Titi Panakkukang": 5
#         } 
#     },
#     {
#         "nama":"dm4",
#         "skor_akhir": [
#             0.5,
#             0.5,
#             0.6,
#             0.6,
#             0.7
#         ],
#         "peringkat": {
#             "Sop Saudara Irian": 5,
#             "Coto Maros": 4,
#             "Coto Nusantara": 3,
#             "Pallubasa Serigala": 2,
#             "Mie Titi Panakkukang": 1
#         } 
#     }
# ]

def hitung_borda(data):
    bobot={i:j for i,j in zip(range(1,len(data[0]['peringkat'])+1),range(len(data[0]['peringkat']),0,-1))}
    alternatif=[i for i,j in data[0]['peringkat'].items()]

    ranking_view=[{i['nama']:{j:k for j,k in i['peringkat'].items()}} for i in data]

    ranking_on_criteria=[{i:[value for item in data for key,value in item['peringkat'].items() if key==i]} for i in alternatif ]

    skor_akhir_on_criteria=[[i for i in obj['skor_akhir']] for obj in data ]

    #[{'Sop Saudara Irian': [1, 2, 1, 5]}, {'Coto Maros': [2, 5, 2, 4]}, {'Coto Nusantara': [3, 4, 3, 3]}, {'Pallubasa Serigala': [4, 1, 4, 2]}, {'Mie Titi Panakkukang': [5, 3, 5, 1]}]

    bobot_from_ranking=[[bvalue for i in value for bkey,bvalue in bobot.items() if i==bkey] for obj in ranking_on_criteria for key,value in obj.items() ]

    skor=[[k*skor_akhir_on_criteria[j][i] for j,k in enumerate(v)] for i,v in enumerate(bobot_from_ranking)]
    skor_akhir=[sum(i) for i in skor]
    ranking_plain=sorted(enumerate(skor_akhir,start=1),key=lambda x:x[1],reverse=True)

    # result=[{a:{"skor_akhir":vS,"ranking":iS} for iS (i,vS) in enumerate(skor_akhir)}for i,a in enumerate(alternatif)]

    ranking=[{alternatif[i]:{"skor_akhir":vS,"ranking":iS}}for i, (iS,vS) in enumerate(ranking_plain)]

    result={
        "ranking_alternatif_per_decision_maker":ranking_view,
        "perhitungan_skor_borda":ranking
    }

    #skor=[ for i in ranking_on_criteria for key,value in bobot.items() if i==key]
    # printed={
    #     "ranking_view":ranking_view,
    #     "result":resu
    #     }
    return result

input_data=sys.stdin.read()
data=json.loads(input_data)

print(json.dumps(hitung_borda(data)))