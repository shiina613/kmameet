$(function () {
    // Khởi tạo wizard
    $("#wizard").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        transitionEffectSpeed: 500,
        labels: {
            finish: "Submit",  // Nhãn cho nút submit
            next: "Forward",
            previous: "Backward"
        },
        // Định nghĩa hành động khi nhấn nút "Submit" (bước cuối)
        onFinished: function (event, currentIndex) {
            console.log("Dang goi ham create meeting")
            createMeeting()
        }
    });

    // Cập nhật trạng thái các bước khi nhấp vào bước
    $('.wizard > .steps li a').click(function () {
        $(this).parent().addClass('checked');
        $(this).parent().prevAll().addClass('checked');
        $(this).parent().nextAll().removeClass('checked');
    });

    // Tùy chỉnh nút điều hướng
    $('.forward').click(function () {
        $("#wizard").steps('next');
    });
    $('.backward').click(function () {
        $("#wizard").steps('previous');
    });

    // Chức năng dropdown
    $('html').click(function () {
        $('.select .dropdown').hide();
    });
    $('.select').click(function (event) {
        event.stopPropagation();
    });
    $('.select .select-control').click(function () {
        $(this).parent().next().toggle();
    });
    $('.select .dropdown li').click(function () {
        $(this).parent().toggle();
        var text = $(this).attr('rel');
        $(this).parent().prev().find('div').text(text);
    });
});

