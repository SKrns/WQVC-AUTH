// $('#frm_login').validate({
//   onkeyup: false,
//   submitHandler: function () {
//     return true;
//   },
//   rules: {
//     email: {
//       required: true,
//       minlength: 6
//     },
//     password: {
//       required: true,
//       minlength: 3,
//       remote: {
//         url: '/user/login',
//         type: 'post',
//         data: {
//           email: function () {
//             return $('#email').val();
//           }
//         },
//         dataFilter: function (data) {
//           var data = JSON.parse(data);
//           if (data.success) {
//             return true
//           } else {
//             return "\"" + data.msg + "\"";
//           }
//         }
//       }
//     }
//   }
// });


    // <script>
    //     //Form validation.
    //     $('form').validate({
    //         rules: {
    //             fname: {
    //                 minlength: 3,
    //                 maxlength: 15,
    //             }
    //         },
    //         errorPlacement: function(error, element) {},
    //         highlight: function(element) {
    //             var id_attr = "#" + $(element).attr("id") + "1";
    //             $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    //             $(id_attr).removeClass('icon-ok-circled2').addClass('icon-cancel-circled2');
    //         },
    //         unhighlight: function(element) {
    //             var id_attr = "#" + $(element).attr("id") + "1";
    //             $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    //             $(id_attr).removeClass('icon-cancel-circled2').addClass('icon-ok-circled2');
    //         },
    //     });
    // </script>