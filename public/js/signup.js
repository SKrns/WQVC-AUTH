var myCommon = {};
myCommon.util = {
     // method : get/post , url : call url 
     // params    : json 형식 요청 데이터, callbackFunction : callback 함수명
    callAjax : function(method, url, type,params, callbackFunction ){
        if(method=="" || url==""){
            console.log("method or url empty");
            return false;
        }
 
        $.ajax({
             type : method
            , url : url
            , data : JSON.stringify(params)
            , contentType:'application/json; charset=utf-8'
            , dataType: type
            , success : function(response) {
                if (type == "html") {
                        $(document.getElementById(callbackFunction)).html(response);
                } else {
                    // Callback 함수 호출
                    if (typeof(callbackFunction) == "function")
                        callbackFunction(params, response);
                }
            }
            , error : function(jqXHR, error) {
                console.log(error);
            }
        });
    }
}; 

$(document).ready(function() {
    var processScript = true;
    var sendData = {};
 
    $("#signup_btn").click(function(){
        // 버튼 여러번 클릭되지 않게 막기
        if(!processScript){
            alert("처리중입니다.");
            return;
        }
        var fullName = $("#fullName").val();
        var SetEmailAddress = $("#SetEmailAddress").val();
        var SetPassword = $("#SetPassword").val();
        var CheckPassword = $("#CheckPassword").val();
        
 
        sendData.name = fullName;
        sendData.email = SetEmailAddress;
        sendData.password = SetPassword;
        if(!$("#ageFlag").is(":checked")){
            alert('이용약관에 동의해주세요.');
            return;
        }
        if(!$("#termsFlag").is(":checked")){
            alert('이용약관에 동의해주세요.');
            return;
        }
        if(SetPassword!=CheckPassword){
            alert('비밀번호 확인이 올바르지 않습니다');
            return;
        }
        if(!confirm("회원가입하시겠습니까?")){
            return;
        }

        ptcpEvent(sendData);
    });
 
    function ptcpEvent(sendData){
        var url = "/user/signup";
        var type   = "json";
        var requestData = sendData;
        console.log(JSON.stringify(requestData));
        processScript = false;
        myCommon.util.callAjax("POST", url, null,requestData, returnData.myResult);
    };
    
    var returnData = {
        myResult : function(request, response){
            console.log(response)
            if(response.success) {
                alert('회원가입 되었습니다.');
                // location.reload();
            } else {
                alert('회원가입이 실패하였습니다. '+response.msg);
            }
        }
    }
});
