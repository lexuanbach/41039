class Student:
    def __init__(self, name, mark):
        self.name = name
        self.mark = mark
    def passed(self):
        return self.mark >= 50
def load(rows):
    students = []
    for row in rows:
        try:
            name, text = row.split(",")
            mark = int(text)
            students.append(Student(name, mark))
        except ValueError:
            print("Invalid:", row)
    return students
rows = ["Linh,85", "An,abc", "Mai,50", "Tuan"]
kept = load(rows)
print(len(kept), sum(s.passed() for s in kept))
