from sqlalchemy import Column, Integer, String, Numeric, TEXT, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    student_number = Column(String)


class TA(Base):
    __tablename__ = "tas"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    rate = Column(Numeric)
    num_vote = Column(Integer)
    comment = Column(TEXT)
    ratings = relationship("TARating", back_populates="ta")


class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    name = Column(String)
    mail = Column(String, unique=True, index=True)
    password = Column(String)
    dep_id = Column(Integer, ForeignKey("departments.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))


class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))


class TARating(Base):
    __tablename__ = "ratings"
    id = Column(Integer, primary_key=True, index=True)
    rate = Column(Numeric)
    comment = Column(TEXT)
    ta_id = Column(Integer, ForeignKey("tas.id"))
    ta = relationship("TA", back_populates="ratings")
