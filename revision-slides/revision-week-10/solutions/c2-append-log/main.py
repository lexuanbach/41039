def log(path, message):
    with open(path, "a") as f:
        f.write(message + "\n")

def count_lines(path):
    try:
        with open(path) as f:
            return len(f.readlines())
    except FileNotFoundError:
        return 0

log("app.log", "start")
log("app.log", "save")
print(count_lines("app.log"))
log("app.log", "stop")
print(count_lines("app.log"))
print(count_lines("none.log"))
