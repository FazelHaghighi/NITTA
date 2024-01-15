from sqlalchemy.orm import Session
from argon2 import PasswordHasher
from models import Student
from database import engine
from sqlalchemy import select
import jwt

secret = "WooWyVewwyStwongSeeecwetUwU:3"

session = Session(engine)

def authenticate(username: str, password: str):
    ph = PasswordHasher()
    
    stm = select(Student).where(Student.username == username).limit(1)
    try:
        student = session.scalars(stm).one()
    except:
        return [{"code": "-1"}]
    
    try:
        ph.verify(student.password, password)
        dictStudent = {
            "id": student.id,
        }
        encoded = jwt.encode(dictStudent, secret, algorithm="HS256")
        return encoded
    except:
        return [{"code": "0"}]
    