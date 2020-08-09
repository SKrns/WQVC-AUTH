let myCommon = {};
const myUID = $("#myUID").val();
const myEMAIL = $("#myEMAIL").val();
const myNAME = $("#myNAME").val();
let newConferenceCode = `
<div class="col">
    <div class="card" data-toggle="modal" data-target="#newConferenceModal">
          <div class="card-body">
            <h1 class="card-title">+</h1>
            <p class="card-text">새 회의 생성</p>
          </div>                              
    </div>
</div>
`;



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
    $('#new-tags').inputTags({tags:[myEMAIL]});

    let processScript = true;
    
    $("#refresh").click(function(){
        let sendData = {};
        let url = "/participant/"+myUID;
        ptcpEvent(sendData,url,"GET");
    });

    $("#new-conference-button").click(function(){
        let sendData = {};
        let url = "/conference/create";
        sendData.name = $("#new-recipient-name").val();
        sendData.contents = $("#new-recipient-contents").val();
        sendData.start_date = $("#new-recipient-starttime").val();
        sendData.end_date = $("#new-recipient-endtime").val();
        sendData.owner = myUID;
        sendData.participants = $("#new-tags").val().split(',');
        newConferenceEvent(sendData,url,"POST");
    });

    $("#modify-user-button").click(function(){
        let sendData = {};
        let url = "/user/modify";
        sendData.email = $("#recipient-email").val();
        sendData.name = $("#recipient-name").val();
        sendData.password = $("#recipient-password").val();
        sendData.passwordCheck = $("#recipient-passwordCheck").val();
        modifyUserEvent(sendData,url,"POST");
    });

    $("#delete-user-button").click(function(){
        let sendData = {};
        let url = "/user/delete";
        sendData.uid = $("#myUID").val();

        deleteUserEvent(sendData,url,"POST");
    });
 
    function ptcpEvent(sendData,url,method){
        var type   = "json";
        var requestData = sendData;
        processScript = false;
        myCommon.util.callAjax(method, url, null,requestData, returnData.myResult);
    };

    function newConferenceEvent(sendData,url,method){
        var type   = "json";
        var requestData = sendData;
        processScript = false;
        myCommon.util.callAjax(method, url, null,requestData, returnData.newConferenceResult);
    };

    function modifyUserEvent(sendData,url,method){
        var type   = "json";
        var requestData = sendData;
        processScript = false;
        myCommon.util.callAjax(method, url, null,requestData, returnData.modifyUserResult);
    };

    function deleteUserEvent(sendData,url,method){
        var type   = "json";
        var requestData = sendData;
        processScript = false;
        myCommon.util.callAjax(method, url, null,requestData, returnData.deleteUserResult);
    };
    
    var returnData = {
        myResult : function(request, response){
            $('#dashboard *').remove();
            for (var res of response) {
                let conference_name = res.conference_name;
                let owner_name = res.owner_name;
                let owner_uid = res.owner_uid;
                let conference_contents = res.conference_contents;
                let conference_uid = res.conference_uid;
                let conferenceChat_url = `https://localhost:8081/chat/${conference_uid}_${myNAME}`; //edit
                let conferenceVideo_url = `https://localhost:8080/index.html?roomName=${conference_uid}&userName=${myNAME}`; //edit
                let conferenceEditCode = (myUID==owner_uid?`<div class="col"><button type="button" class="btn btn-link" data-toggle="modal" data-target="">회의 편집</button></div>` : '');
                let code =`
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${conference_name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${owner_name}</h6>
                            <p class="card-text">${conference_contents}</p>
                            <button class="btn lt-register-btn " onclick="location.href='${conferenceVideo_url}'">회의 참여 <i class="icon-right pull-right "></i></button>
                            <br>
                            <div class="row conference-advanced">
                                ${conferenceEditCode}
                                <div class="col"><button type="button" class="btn btn-link" onclick="location.href='${conferenceChat_url}'">채팅 참여</button></div>
                            </div>
                            <br>
                        </div>                              
                    </div>
                </div>`;
                $('#dashboard').append(code);           
            }
            $('#dashboard').append(newConferenceCode);     
        },

        newConferenceResult : function(request, response) {
            console.log(response);
            if (response.success) {
                location.reload();
            } else {
                alert('잠시후에 다시시도해주세요.');
            }
        },

        modifyUserResult : function(request, response) {
            if (response.success) {
                location.reload();
            } else {
                alert(response.msg);
            }
        },

        deleteUserResult : function(request, response) {
            if (response.success) {
                window.location.replace('/logout')
            } else {
                alert(response.msg);
            }
        }
    }
    ptcpEvent({},"/participant/"+myUID,"GET");
});
