$(document).ready(function() {
    // Validate dữ liệu nhập vào đáp ứng điều kiện không:
    // 1. Không bỏ trống
    // 2. Điểm số là number trong khoảng từ 1 - 10
    $("#form-input").validate({
        rules: {
            name: {
              required: true,
              minlength: 2,
            },
            math: {
              required: true,
              rangelength: [1, 10],
            },
            physical: {
              required: true,
              rangelength: [1, 10],
            },
            chemistry: {
              required: true,
              rangelength: [1, 10],
            },
          },
          messages: {
            name: {
              required: "Vui lòng không bỏ trống",
              minlength: "Vui lòng nhập đầy đủ họ tên",
            },
            math: {
              required: "Vui lòng không bỏ trống",
              rangelength: "Vui lòng nhập số từ 1 đến 10",
            },
            physical: {
              required: "Vui lòng không bỏ trống",
              rangelength: "Vui lòng nhập số từ 1 đến 10",
            },
            chemistry: {
              required: "Vui lòng không bỏ trống",
              rangelength: "Vui lòng nhập số từ 1 đến 10",
            }
          }
    });

    // Nhập số liệu vào bảng
    $("#input-data").click(function(event) {
        // Dừng khi validate không đúng
        event.preventDefault();
        // Lấy input element
        let name = $("#name");
        let math = $("#math");
        let physical = $("#physical");
        let chemistry = $("#chemistry");

        // Tạo array td để add vào bảng
        let tds = [
        "<td></td>",
        "<td></td>",
        "<td></td>",
        "<td></td>",
        "<td></td>",
        "<td>?</td>",
        "<td></td>",
        "<td></td>"
        ];

        let list = $("#mark-table tr").length;
        tds[0] = "<td>" + list + "</td>";
        tds[1] = "<td>" + name.val() + "</td>";
        tds[2] = "<td>" + math.val() + "</td>";
        tds[3] = "<td>" + physical.val() + "</td>";
        tds[4] = "<td>" + chemistry.val() + "</td>";

        // Nếu validate là đúng thì add dữ liệu vào table, nếu sai thì preventDefault
        if($('form').valid()) {
            $("#mark-table tbody").append("<tr>" + tds.join("") + "</tr");
        }

        // Sau khi dữ liệu được nhập, xóa trắng trên input
        $('input').val('');
    });

    // Tính điểm trung bình
    $('#average').click(function() {
        $('#mark-table tr').each(function() {
            // Lấy row và các giá trị td hiện tại bằng hàm each
            let currentRow = $(this);
            let math = currentRow.find('td:nth-child(3)').text();
            let physical = currentRow.find('td:nth-child(4)').text();
            let chemistry = currentRow.find('td:nth-child(5)').text();

            // Chuyển đổi text sang number bằng parseInt
            let average = (((parseInt(math)) + parseInt(physical) + parseInt(chemistry)) / 3).toFixed(1);
            currentRow.find('td:nth-child(6)').text(average);
        });
    });

    // Phân loại học sinh và kết quả
    // Với số điểm khác nhau được lấy từ giá trị của td thông qua vòng lặp
    // Để cho ra phân loại giỏi - khá - trung bình - yếu và kết quả đỗ/trược bằng hàm if
    $('#level').click(function() {
        $('#mark-table tr').each(function() {
            let currentRow = $(this);
            let average = currentRow.find('td:nth-child(6)').text();
            let level = currentRow.find('td:nth-child(7)');
            let result = currentRow.find('td:nth-child(8)');
            if (average > 8.0) {
                currentRow.css('color', 'red');
                level.text('Giỏi');
                result.text('Đỗ');
            } else if (average > 7.0) {
                level.text('Khá');
                result.text('Đỗ');
            } else if (average > 5.0) {
                level.text('Trung bình');
                result.text('Trượt');
            } else {
                level.text('Yếu');
                result.text('Trượt');
            }
        });
    });


    // Sort bảng khi click vào th
    // f: có giá trị 1 thì asc order, -1 thì des order
    // n: vị trí n-th child(<td>) trong <tr>
    function sortTable(f,n){
        // Lấy row hiện tại của bảng trong tbody
        let rows = $('#mark-table tbody tr').get();
        
        // Hàm sort với hàm if nếu x < y trả giá trị negative number => tham số a nhỏ hơn b
        // Nếu x > y trả giá trị positive number => tham số a lớn hơn b
        // Nếu x = y trả giá trị 0 => tham số a = b
        rows.sort(function(a, b) {
            let x = getVal(a);
            let y = getVal(b);

            if(x < y) {
                return -1*f;
            }
            if(x > y) {
                return 1*f;
            }
            return 0;
        });
    
        // Lấy tham số a qua hàm getVal(elem)
        // Chuyển đổi giá trị trong td thành uppercase với text
        // Nếu là số thì dùng parseInt để chuyển đổi thành integer
        function getVal(elm){
            let v = $(elm).children('td').eq(n).text().toUpperCase();
            if($.isNumeric(v)){
                v = parseInt(v,10);
            }
            return v;
        }
        
        // Add thành bảng table mới sau khi sort
        $.each(rows, function(index, row) {
            $('#mark-table').children('tbody').append(row);
        });
    }

    // Biến f_sl và f_nm chỉ để dễ phân biệt hàm sort áp dụng cho text và number
    let f_sl = 1;
    let f_nm = 1;
    $("#table-list").click(function(){
        f_sl *= -1;
        let n = $(this).prevAll().length;
        sortTable(f_sl,n);
    });
    $("#fullname").click(function(){
        f_nm *= -1;
        let n = $(this).prevAll().length;
        sortTable(f_nm,n);
    });
    $("#math-mark").click(function(){
        f_sl *= -1;
        let n = $(this).prevAll().length;
        sortTable(f_sl,n);
    });
    $("#physical-mark").click(function(){
        f_sl *= -1;
        let n = $(this).prevAll().length;
        sortTable(f_sl,n);
    });
    $("#chemistry-mark").click(function(){
        f_sl *= -1;
        let n = $(this).prevAll().length;
        sortTable(f_sl,n);
    });
    $("#average-mark").click(function(){
        f_sl *= -1;
        let n = $(this).prevAll().length;
        sortTable(f_sl,n);
    });
    $("#mark-level").click(function(){
        f_nm *= -1;
        let n = $(this).prevAll().length;
        sortTable(f_nm,n);
    });
    $("#mark-result").click(function(){
        f_nm *= -1;
        let n = $(this).prevAll().length;
        sortTable(f_nm,n);
    });
    $("#myInput").on("keyup",function(){
        value = $(this).val().toLowerCase();
        $("#mark-table tr").filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        })
    })
});