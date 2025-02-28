const request = require("supertest");
const express = require("express");
const router = require("../routes/students.js"); // Import the router handling /add
const fs = require("fs");

// Mock Express app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

// Mock students.json file
jest.mock("fs");

const mockStudents = [
    {
        id: "23010001",
        name: "Nguyen Van A",
        dob: "2005-08-15",
        gender: "Nam",
        faculty: "CNTT",
        course: "2023",
        program: "KTPM",
        address: "123 Street",
        email: "student@example.com",
        phone: "0912345678",
        status: "Active"
    }
];

beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockStudents));
    fs.writeFileSync.mockImplementation(() => {});
});

describe("POST /add", () => {
    it("should add a new student successfully", async () => {
        const newStudent = {
            id: "24020002",
            name: "Le Thi B",
            dob: "2006-09-10",
            gender: "Nữ",
            faculty: "Toán",
            course: "2024",
            program: "ĐTVT",
            address: "456 Street",
            email: "newstudent@example.com",
            phone: "0987654321",
            status: "Active"
        };

        const response = await request(app).post("/add").send(newStudent);
        
        expect(response.status).toBe(302);
        expect(response.text).toContain("Found. Redirecting to /");
    });

    it("should return an error if MSSV already exists", async () => {
        const duplicateStudent = { ...mockStudents[0] };

        const response = await request(app).post("/add").send(duplicateStudent);
        
        expect(response.status).toBe(400);
        expect(response.text).toContain("MSSV đã tồn tại!");
    });

    it("should return an error if email is invalid", async () => {
        const invalidStudent = {
            ...mockStudents[0],
            id: "24020003",
            email: "invalid-email"
        };

        const response = await request(app).post("/add").send(invalidStudent);
        
        expect(response.status).toBe(400);
        expect(response.text).toContain("Email không hợp lệ.");
    });

    it("should return an error if phone number is invalid", async () => {
        const invalidStudent = {
            ...mockStudents[0],
            id: "24020004",
            phone: "12345"
        };

        const response = await request(app).post("/add").send(invalidStudent);
        
        expect(response.status).toBe(400);
        expect(response.text).toContain("Số điện thoại không hợp lệ.");
    });

    it("should return an error if student is under 16 years old", async () => {
        const underageStudent = {
            ...mockStudents[0],
            id: "24020005",
            dob: "2010-10-10"
        };

        const response = await request(app).post("/add").send(underageStudent);
        
        expect(response.status).toBe(400);
        expect(response.text).toContain("Sinh viên phải ít nhất 16 tuổi.");
    });
});