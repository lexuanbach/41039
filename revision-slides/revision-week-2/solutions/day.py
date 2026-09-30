day = input("Day number (1-7): ")

day = int(day)                  # forget this and "6" matches no case: "Invalid day", no error

match day:
    case 6 | 7:                 # | gives one case several values -- Java stacks case labels
        print("Weekend")
    case 1 | 2 | 3 | 4 | 5:
        print("Weekday")
    case _:                     # Java's default
        print("Invalid day")
                                # no break anywhere: match never falls through
