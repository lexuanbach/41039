def log(path, message):
    pass  # TODO

def count_lines(path):
    # TODO
    return 0

log("app.log", "start")
log("app.log", "save")
print(count_lines("app.log"))
log("app.log", "stop")
print(count_lines("app.log"))
print(count_lines("none.log"))
