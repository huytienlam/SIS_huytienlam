#pragma once

#include <string>
#include <regex>
#include <iostream>
#include <sstream>
using namespace std;

class Student {
private:
    string studentID;
    string name;
    string dob;
    string gender;
    string faculty;
    string batch;
    string program;
    string address;
    string email;
    string phone;
    string status;

public:
    Student(string id, string n, string d, string g, string f, string b, string p, string a, string e, string ph, string s);

    string getID() { return studentID; }
    string getName() { return name; }
    string getDOB() { return dob; }
    string getGender() { return gender; }
    string getFaculty() { return faculty; }
    string getBatch() { return batch; }
    string getProgram() { return program; }
    string getAddress() { return address; }
    string getEmail() { return email; }
    string getPhone() { return phone; }
    string getStatus() { return status; }

    void setName(string newName) { name = newName; }
    bool setEmail(string newEmail);
    bool setPhone(string newPhone);
    bool setFaculty(string newFaculty);
    bool setStatus(string newStatus);
    void setAddress(string newAddress) { address = newAddress; }

    void printStudent();
    
    static bool isValidID(string id);
    static bool isValidEmail(string email);
    static bool isValidPhone(string phone);
    static bool isValidFaculty(string faculty);
    static bool isValidStatus(string status);
    static bool isValidDate(string date);
};