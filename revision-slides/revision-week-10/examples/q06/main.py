import json
record={"name":"Linh","marks":[85,90]}
text=json.dumps(record,sort_keys=True)
restored=json.loads(text)
print(restored["name"])
print(sum(restored["marks"]))
print(restored==record)
