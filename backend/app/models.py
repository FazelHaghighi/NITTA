from sqlalchemy import Column, Integer, String, Numeric, TEXT, ForeignKey, Boolean, TIMESTAMP, ARRAY
from sqlalchemy.dialects.postgresql import JSONB
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
    student_id = Column(Integer, ForeignKey("students.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    num_vote = Column(Integer)
    ratings = relationship("TARating", back_populates="ta")

class TAComments(Base):
    __tablename__ = "tas_comments"
    id = Column(Integer, primary_key=True, index=True)
    ta_id = Column(Integer, ForeignKey("tas.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    comment = Column(JSONB)
    rate = Column(Numeric)
    vote = Column(Integer)

class TACommentsVote(Base):
    __tablename__ = "tas_comments_vote"
    id = Column(Integer, primary_key=True, index=True)
    commenter_id = Column(Integer, ForeignKey("students.id"))
    voter_id = Column(Integer, ForeignKey("students.id"))
    ta_id = Column(Integer, ForeignKey("students.id"))


class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    credit_points = Column(Integer)

class LessonPrequisite(Base):
    __tablename__ = "lesson_preq"
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    preq_id = Column(Integer, ForeignKey("lessons.id"))

class LessonRequisite(Base):
    __tablename__ = "lesson_reqs"
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    req_id = Column(Integer, ForeignKey("lessons.id"))

class TeacherLesson(Base):
    __tablename__ = "teacher_lessons"
    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    name = Column(String)
    mail = Column(String, unique=True, index=True)
    password = Column(String)
    dep_id = Column(Integer, ForeignKey("departments.id"))


class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    is_completed = Column(Boolean)
    additional_note = Column(TEXT)
    is_accepted = Column(Boolean)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

class RequestPreq(Base):
    __tablename__ = "request_preqs"
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"))
    preq_id = Column(Integer, ForeignKey("lessons.id"))
    grade = Column(Integer)

class TARating(Base):
    __tablename__ = "ratings"
    id = Column(Integer, primary_key=True, index=True)
    rate = Column(Numeric)
    comment = Column(TEXT)
    ta_id = Column(Integer, ForeignKey("tas.id"))
    ta = relationship("TA", back_populates="ratings")
