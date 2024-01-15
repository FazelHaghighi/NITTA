'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Student {
  id: number;
  email: string;
  name: string;
  username: string;
}

interface Teacher {
  id: number;
  name: string;
}

interface Lesson {
  id: number;
  name: string;
}

function StudentComponent({ student }: { student: Student | undefined }) {
  return (
    <>
      <p>شماره دانشجویی : {student?.id}</p>
      <p>نام : {student?.name}</p>
      <p>نام کاربری : {student?.username}</p>
      <p>email : {student?.email}</p>
    </>
  );
}

const Dashboard = ({
  showStudent,
  student,
}: {
  showStudent: boolean;
  student: Student | undefined;
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedLessons, setSelectedLessons] = useState<Lesson[]>([]);

  const teachers: Teacher[] = [
    { id: 1, name: 'استاد ۱' },
    { id: 2, name: 'استاد ۲' },
    { id: 3, name: 'استاد ۳' },
  ];

  const lessons: Lesson[] = [
    { id: 1, name: 'درس ۱' },
    { id: 2, name: 'درس ۲' },
    { id: 3, name: 'درس ۳' },
  ];

  const handleTeacherSelection = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setSelectedLessons([]);
  };

  const handleLessonSelection = (lesson: Lesson) => {
    const lessonIndex = selectedLessons.findIndex((l) => l.id === lesson.id);
    if (lessonIndex === -1) {
      setSelectedLessons([...selectedLessons, lesson]);
    } else {
      setSelectedLessons(selectedLessons.filter((l) => l.id !== lesson.id));
    }
  };

  return (
    <div>
      <nav dir="ltr" className="bg-gray-800">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-16">
            <div className="flex items-center">
              <h2 className="text-2xl text-white font-bold">داشبورد دانشجو</h2>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="#"
                    className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    پنل اصلی
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    لیست استادان
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    لیست دستیاران آموزشی
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    خروج
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col p-8 w-2/3 mx-auto space-y-12">
        <div className="flex bg-[#D9D9D9] mix-blend-multiply rounded-md px-4 pb-4">
          <div className="flex flex-row-reverse w-full justify-between mt-4">
            <div>
              <Image
                src="/profile.png"
                alt="Profile picture"
                className="w-full h-auto"
                width={64}
                height={64}
              />
            </div>
            <div>{showStudent && <StudentComponent student={student} />}</div>
          </div>
        </div>
        <div className="space-y-4 bg-[#b6b6b6fb] mix-blend-multiply rounded-md p-4">
          <div className="">
            <h4 className="text-lg font-bold">انتخاب استاد</h4>
            <ul className="mt-4">
              {teachers.map((teacher) => (
                <li
                  key={teacher.id}
                  onClick={() => handleTeacherSelection(teacher)}
                  className="cursor-pointer hover:text-blue-500"
                >
                  {teacher.name}
                </li>
              ))}
            </ul>
          </div>
          {selectedTeacher && (
            <div className="">
              <h4 className="text-lg font-bold">
                انتخاب درس برای {selectedTeacher.name}
              </h4>
              <ul className="mt-4">
                {lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    onClick={() => handleLessonSelection(lesson)}
                    className={`cursor-pointer ${
                      selectedLessons.some((l) => l.id === lesson.id)
                        ? 'line-through'
                        : ''
                    }`}
                  >
                    {lesson.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
