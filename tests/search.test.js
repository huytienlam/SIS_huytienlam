const database = [
    { id: "22127154", name: "Lâm Tiến Huy", dob: "2002-02-14", gender: "Nam", faculty: "Khoa Công nghệ thông tin", course: "2022", program: "Cử nhân", address: "ssdjifsud", email: "lthuy22@clc.fitus.edu.vn", phone: "0703102330", status: "Đang học" },
    { id: "22127153", name: "Lâm Tiến Huy", dob: "2002-02-14", gender: "Male", faculty: "Khoa Công nghệ thông tin", course: "2022", program: "Cử nhân", address: "Fdfdsd", email: "huytienlam@gmail.com", phone: "0739572452", status: "Đang học" },
    { id: "22127151", name: "Lâm Tiến Huy", dob: "2001-02-28", gender: "Male", faculty: "Khoa Công nghệ thông tin", course: "2022", program: "Cử nhân", address: "Fdfdsd", email: "hello@gmail.com", phone: "0827393443", status: "Đã tốt nghiệp" }
  ];
  
  function searchDatabase(query, key) {
    return database.filter(entry => entry[key] && entry[key] === query);
  }
  
  test("Tìm kiếm theo ID", () => {
    const result = searchDatabase("22127154", "id");
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Lâm Tiến Huy");
  });
  
  test("Tìm kiếm theo tên", () => {
    const result = searchDatabase("Lâm Tiến Huy", "name");
    expect(result.length).toBe(3);
  });
  
  test("Tìm kiếm theo email", () => {
    const result = searchDatabase("lthuy22@clc.fitus.edu.vn", "email");
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("22127154");
  });
  
  test("Tìm kiếm theo trạng thái", () => {
    const result = searchDatabase("Đang học", "status");
    expect(result.length).toBe(2);
  });
  
  test("Tìm kiếm với dữ liệu không tồn tại", () => {
    const result = searchDatabase("Nguyễn Văn A", "name");
    expect(result.length).toBe(0);
  });  