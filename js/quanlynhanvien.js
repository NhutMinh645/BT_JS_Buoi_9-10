

// Khởi tạo danh sách nhân viên
let danhSachNhanVien = [];


document.getElementById("btnThemNV").addEventListener("click", themNhanVien);
document.getElementById("btnCapNhat").style.display = "none";
document.getElementById("btnCapNhat").addEventListener("click", () => {});
document.getElementById("btnTimNV").addEventListener("click", timNhanVienTheoLoai);



// kiểm tra dữ liệu nhập 
function validateField(value, validator, errorMessage, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (!validator(value)) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = "inline";
        return false;
    }
    errorElement.textContent = "";
    errorElement.style.display = "none";
    return true;
}


function kiemTraHopLe() {
    let hopLe = true;

    hopLe &= validateField(
        document.getElementById("tknv").value.trim(),
        value => /^\d{4,6}$/.test(value),
        "Tài khoản phải là số và có từ 4 đến 6 ký số",
        "tbTKNV"
    );

    hopLe &= validateField(
        document.getElementById("name").value.trim(),
        value => /^[a-zA-Z\s]+$/.test(value),
        "Họ tên chỉ chứa chữ cái và không được để trống",
        "tbTen"
    );

    hopLe &= validateField(
        document.getElementById("email").value.trim(),
        value => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
        "Email không hợp lệ",
        "tbEmail"
    );

    hopLe &= validateField(
        document.getElementById("password").value.trim(),
        value => /^(?=.*\d)(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/.test(value),
        "Mật khẩu phải chứa 6-10 ký tự, gồm ít nhất 1 số, 1 chữ in hoa, 1 ký tự đặc biệt",
        "tbMatKhau"
    );

    hopLe &= validateField(
        document.getElementById("datepicker").value.trim(),
        value => /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(value),
        "Ngày làm không hợp lệ, phải có định dạng mm/dd/yyyy",
        "tbNgay"
    );

    hopLe &= validateField(
        document.getElementById("luongCB").value.trim(),
        value => !isNaN(value) && parseFloat(value) >= 1000000 && parseFloat(value) <= 20000000,
        "Lương cơ bản phải là số từ 1.000.000 đến 20.000.000",
        "tbLuongCB"
    );

    hopLe &= validateField(
        document.getElementById("chucvu").value,
        value => ["Sếp", "Trưởng phòng", "Nhân viên"].includes(value),
        "Vui lòng chọn chức vụ hợp lệ",
        "tbChucVu"
    );

    hopLe &= validateField(
        document.getElementById("gioLam").value.trim(),
        value => !isNaN(value) && parseFloat(value) >= 80 && parseFloat(value) <= 200,
        "Giờ làm phải là số từ 80 đến 200",
        "tbGiolam"
    );

    return !!hopLe; 
}
// lưu danh sách nhân viên 
function luuDanhSachNhanVien() {
    localStorage.setItem("danhSachNhanVien", JSON.stringify(danhSachNhanVien));
}

// tải danh sách nhân viên 
function taiDanhSachNhanVien() {
    const data = localStorage.getItem("danhSachNhanVien");
    if (data) {
        danhSachNhanVien = JSON.parse(data);
        hienThiDanhSachNhanVien(danhSachNhanVien);
    }
}

// thêm nhân viên
function themNhanVien() {
    if (!kiemTraHopLe()) return;

    
    const nhanVien = {
        taiKhoan: document.getElementById("tknv").value.trim(),
        hoTen: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        ngayLam: document.getElementById("datepicker").value.trim(),
        chucVu: document.getElementById("chucvu").value,
        luongCB: parseFloat(document.getElementById("luongCB").value),
        gioLam: parseFloat(document.getElementById("gioLam").value),
    };

    nhanVien.xepLoai = xepLoaiNhanVien(nhanVien.gioLam);
    nhanVien.tongLuong = tinhTongLuong(nhanVien.luongCB, nhanVien.chucVu);

    danhSachNhanVien.push(nhanVien);
    luuDanhSachNhanVien();
    hienThiDanhSachNhanVien(danhSachNhanVien);
    resetForm();
}

// xếp loại nv
function xepLoaiNhanVien(gioLam) {
    if (gioLam >= 192) return "Xuất sắc";
    if (gioLam >= 176) return "Giỏi";
    if (gioLam >= 160) return "Khá";
    return "Trung bình";
}
// tính lương nv
function tinhTongLuong(luongCB, chucVu) {
    if (chucVu == "Sếp") {
        return luongCB * 3;
    } else if (chucVu == "Trưởng phòng") {
        return luongCB * 2;
    } else {
        return luongCB;
    }
}
// hiện thị danh sách nv
function hienThiDanhSachNhanVien(danhSach) {
    let tbody = document.getElementById("tableDanhSach");
    tbody.innerHTML = "";

    danhSach.forEach((nv, index) => {
        let row = tbody.insertRow();

        row.innerHTML = `
            <td>${nv.taiKhoan}</td>
            <td>${nv.hoTen}</td>
            <td>${nv.email}</td>
            <td>${nv.ngayLam}</td>
            <td>${nv.chucVu}</td>
            <td>${nv.tongLuong.toLocaleString()}</td>
            <td>${nv.xepLoai}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="xoaNhanVien(${index})">Xóa</button>
                <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal" onclick="chinhSuaNhanVien(${index})">Sửa</button>
            </td>
        `;
    });
}

function resetForm() {
    document.getElementById("tknv").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("datepicker").value = "";
    document.getElementById("luongCB").value = "";
    document.getElementById("chucvu").value = "Chọn chức vụ";
    document.getElementById("gioLam").value = "";
}

// xoá nv
function xoaNhanVien(index) {
    
    danhSachNhanVien.splice(index, 1);
    luuDanhSachNhanVien();
    hienThiDanhSachNhanVien(danhSachNhanVien);
}

// chỉnh sửa nv
function chinhSuaNhanVien(index) {
   

    let nv = danhSachNhanVien[index];

    document.getElementById("tknv").value = nv.taiKhoan;
    document.getElementById("name").value = nv.hoTen;
    document.getElementById("email").value = nv.email;
    document.getElementById("datepicker").value = nv.ngayLam;
    document.getElementById("luongCB").value = nv.luongCB;
    document.getElementById("chucvu").value = nv.chucVu;
    document.getElementById("gioLam").value = nv.gioLam;

   
    document.getElementById("btnThemNV").style.display = "none";
    document.getElementById("btnCapNhat").style.display = "inline";

    document.getElementById("header-title").innerHTML = "Cập Nhật"
    document.getElementById("btnCapNhat").onclick = null;
    document.getElementById("btnCapNhat").onclick = () => capNhatNhanVien(index);
}

document.getElementById("btnThem").onclick = ()=>{
    resetForm();

    document.getElementById("btnThemNV").style.display = "inline-block";

    document.getElementById("header-title").innerHTML = "Log In"

    document.getElementById("btnCapNhat").style.display = "none";


}

// Cập nhật thông tin nhân viên
function capNhatNhanVien(index) {
   
    if (!kiemTraHopLe()) return;

   
    let nv = danhSachNhanVien[index];

    
    const taiKhoan = document.getElementById("tknv").value.trim();
    const hoTen = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const ngayLam = document.getElementById("datepicker").value.trim();
    const chucVu = document.getElementById("chucvu").value;
    const luongCB = parseFloat(document.getElementById("luongCB").value);
    const gioLam = parseFloat(document.getElementById("gioLam").value);

   
    const hopLe =
        validateField(taiKhoan, value => /^\d{4,6}$/.test(value), "Tài khoản không hợp lệ", "tbTKNV") &&
        validateField(hoTen, value => /^[a-zA-Z\s]+$/.test(value), "Họ tên không hợp lệ", "tbTen") &&
        validateField(email, value => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value), "Email không hợp lệ", "tbEmail") &&
        validateField(
            ngayLam,
            value => /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(value),
            "Ngày làm không hợp lệ",
            "tbNgay"
        ) &&
        validateField(
            luongCB,
            value => !isNaN(value) && value >= 1000000 && value <= 20000000,
            "Lương cơ bản không hợp lệ",
            "tbLuongCB"
        ) &&
        validateField(chucVu, value => ["Sếp", "Trưởng phòng", "Nhân viên"].includes(value), "Chức vụ không hợp lệ", "tbChucVu") &&
        validateField(
            gioLam,
            value => !isNaN(value) && value >= 80 && value <= 200,
            "Giờ làm không hợp lệ",
            "tbGiolam"
        );

   
    if (!hopLe) return;

    
    nv.taiKhoan = taiKhoan;
    nv.hoTen = hoTen;
    nv.email = email;
    nv.ngayLam = ngayLam;
    nv.chucVu = chucVu;
    nv.luongCB = luongCB;
    nv.gioLam = gioLam;
    nv.xepLoai = xepLoaiNhanVien(gioLam);
    nv.tongLuong = tinhTongLuong(luongCB, chucVu);

    luuDanhSachNhanVien();

    hienThiDanhSachNhanVien(danhSachNhanVien);
    resetForm();
    document.getElementById("btnThemNV").style.display = "inline";
    document.getElementById("btnCapNhat").style.display = "none";
   
   
}
// Tải danh sách nhân viên từ localStorage 
document.addEventListener("DOMContentLoaded", () => {
    taiDanhSachNhanVien();
});

// tìm nhân viên
function timNhanVienTheoLoai() {
    
    const loai = document.getElementById("searchName").value.trim().toLowerCase();

   
    const ketQua = danhSachNhanVien.filter(nv => nv.xepLoai.toLowerCase() === loai);

    
    const table = document.getElementById("tableDanhSach");
    table.innerHTML = ""; 

    if (ketQua.length === 0) {
        table.innerHTML = `<tr><td colspan="8" class="text-center">Không tìm thấy nhân viên loại ${loai}</td></tr>`;
    } else {
        ketQua.forEach(nv => {
            const newRow = table.insertRow();
            newRow.innerHTML = `
                <td>${nv.taiKhoan}</td>
                <td>${nv.hoTen}</td>
                <td>${nv.email}</td>
                <td>${nv.ngayLam}</td>
                <td>${nv.chucVu}</td>
                <td>${nv.tongLuong.toLocaleString()}</td>
                <td>${nv.xepLoai}</td>
                <td>
                    <button onclick="chinhSuaNhanVien(${danhSachNhanVien.indexOf(nv)})" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal">sửa</button>
                    <button onclick="xoaNhanVien(${danhSachNhanVien.indexOf(nv)})" class="btn btn-danger btn-sm">Xóa</button>
                </td>
            `;
        });
    }
}





