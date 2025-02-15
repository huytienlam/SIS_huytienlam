#pragma once

#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <iomanip>
#include "student.h"
using namespace std;

class StudentManager {
private:
    vector<Student> students;

public:
    void addStudent(Student student);
    void removeStudent(string id);
    void updateStudent(string id);
    void searchStudent(string keyword);
    void displayAllStudents();
    void loadFromFile(string filename);
    void saveToFile(string filename);
};