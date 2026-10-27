from io import StringIO
buffer=StringIO()
buffer.write("tea")
buffer.write("coffee")
print(repr(buffer.getvalue()))
buffer.close()
