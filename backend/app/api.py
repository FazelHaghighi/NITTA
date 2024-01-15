from crud import (get_students)
from sqlalchemy.orm import Session

def authenticate(db: Session, username: str, password: str):
    students = get_students(db, 0, 10)
    for student in students:
        if student.username == username:
            return student
    
    return []