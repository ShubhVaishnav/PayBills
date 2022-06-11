var recorder, audioStream;

var recordButton_1 = document.getElementById("recordButton_1");
var recordButton_2 = document.getElementById("recordButton_2");
var recordButton_3 = document.getElementById("recordButton_3");

//Record button for OTP
var recordButton_4 = document.getElementById("recordButton_4");

//Record button for game number selection
var recordButton_5 = document.getElementById("recordButton_5");

if(recordButton_1)
{
    recordButton_1.addEventListener("click", toggleRecording);
}
if(recordButton_2)
{
    recordButton_2.addEventListener("click", toggleRecording);
}
if(recordButton_3)
{
    recordButton_3.addEventListener("click", toggleRecording);
}
if(recordButton_4)
{
    recordButton_4.addEventListener("click", toggleRecording);
}
if(recordButton_5)
{
    recordButton_5.addEventListener("click", toggleRecording);
}

var toggleState_recordButton_1 = false;
var toggleState_recordButton_2 = false;
var toggleState_recordButton_3 = false;

var toggleState_recordButton_4 = false;
var toggleState_recordButton_5 = false;

var toggleState_dict = {
    "toggleState_recordButton_1" : false,
    "toggleState_recordButton_2" : false,
    "toggleState_recordButton_3" : false,

    "toggleState_recordButton_4" : false,
    "toggleState_recordButton_5" : false,
};

var recorder_dict = {
    "recorder_recordButton_1" : null,
    "recorder_recordButton_2" : null,
    "recorder_recordButton_3" : null,

    "recorder_recordButton_4" : null,
    "recorder_recordButton_5" : null,
}

function toggleRecording(e) {

    var $this = $(this);
    id = $this.attr('id')
    
    //console.log("button id:"+ e.target.id)
    console.log("toggleRecording called.", id, ":", toggleState_dict['toggleState_'+id]);

    if (toggleState_dict['toggleState_'+id] == true) {
        console.log("Returning")
        return;
    }
    toggleState_dict['toggleState_'+id] = true;

    console.log("toggleRecording. id:", id, toggleState_dict['toggleState_'+id]);
    e.stopPropagation();
    e.preventDefault();  
    
    function stopRecordingCallback() {
        console.log("recorder stop callback:",id);
        document.getElementById(id).innerHTML = "Tap to Record";

        let blob = recorder_dict['recorder_'+id].getBlob();        
        console.log("record rtc audio blob:",blob);
        //Sending blob using AJAX call
        if(id=="recordButton_4")
        {
            sendNumericData(blob, id, "/otp_voice_verification/", "otp_token_id", "OTP_token") 
        }
        else if(id == "recordButton_5")
        {
            sendNumericData(blob, id, "/get_number_game/", "draw_number_game_id", "selected_number")
        }
        else
        {
            sendData(blob, id)  
            
            //Autoplay recorded audio
            const audioURL = URL.createObjectURL(blob);
            var audio = new Audio();
            audio.src = audioURL;
            audio.play().catch(function(err){
                console.error(err) // could not play audio
            });
            audio.onended = function(){
                console.log("audio play event ended")
                URL.revokeObjectURL(audioURL);
                audio.remove();
            }
        }  
       
        //Reset recorder object
        recorder_dict['recorder_'+id] = null;

        //Move to next item on voice slider
        var voice_slider_owl = $('#voice_slider');
        voice_slider_owl.trigger('next.owl.carousel');
    }    

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) 
    {
        console.log('getUserMedia supported.toggleState:', toggleState_dict['toggleState_'+id]);

        if (recorder_dict['recorder_'+id] && recorder_dict['recorder_'+id].state == 'recording') {
            console.log("Stopping the recorder");
            recorder_dict['recorder_'+id].stopRecording(stopRecordingCallback);
            console.log("recorder.state", recorder_dict['recorder_'+id].state);
            toggleState_dict['toggleState_'+id] = false;
            console.log("stop recorder", toggleState_dict['toggleState_'+id])
        }
        else {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(async function(stream) {

                let recorder = RecordRTC(stream, {
                    recorderType: StereoAudioRecorder,
                    mimeType: 'audio/wav',
                    numberOfAudioChannels: 1,
                });
                
                recorder.startRecording();
                recorder_dict['recorder_'+id] = recorder;
                console.log("record rtc started",id);
                document.getElementById(id).innerHTML = "Stop recording";

                if (recorder_dict['recorder_'+id] && recorder_dict['recorder_'+id].state == 'stopped') {
                    recorder_dict['recorder_'+id].startRecording();
                    document.getElementById(id).innerHTML = "Stop recording";                                
                    console.log("recorder.state", recorder_dict['recorder_'+id].state);
                    console.log("The recorder started:",id);
                } 
                
                toggleState_dict['toggleState_'+id] = false;
                console.log("success callback", toggleState_dict['toggleState_'+id])

                setTimeout(() => {
                    console.log("15sec timeout")
                    if(recorder_dict['recorder_'+id])
                    {
                        if (recorder_dict['recorder_'+id].state == 'recording') {
                            console.log("Recording timeout after 15 sec:", id)
                            recorder_dict['recorder_'+id].stopRecording(stopRecordingCallback);
                        }
                    }
                }, 15000);                
            });           
        } 
    }
    else 
    {
        console.log('getUserMedia not supported on your browser!');
    }
}

function sendData(blob, button_id) {
    console.log(blob)
    let fd = new FormData;
    fd.append("audio_file", blob); 
    fd.append("button_id", button_id);   
    console.log(fd)
    let token = jQuery("[name=csrfmiddlewaretoken]").val();
  
    $.ajax({
      url: " ",
      type: 'POST',
      headers: { 'X-CSRFToken': token },
      data: fd,
      cache: false,
      processData: false, // essential
      contentType: false, // essential, application/pdf doesn't work.
      enctype: 'multipart/form-data',
      success: function (response) {
        alert("Audio is successfully uploaded.")
      },
      error: function(response) {
        alert("Error occured : " + response.responseJSON["errMsg"])
      }
    });
  }

function sendNumericData(blob, button_id, endpoint, form_field_id, response_field){
    console.log(blob)
    let fd = new FormData;
    fd.append("audio_file", blob); 
    fd.append("button_id", button_id);   
    console.log(fd)
    let token = jQuery("[name=csrfmiddlewaretoken]").val();
  
    $.ajax({
        url: endpoint,
        type: 'POST',
        headers: { 'X-CSRFToken': token },
        data: fd,
        cache: false,
        processData: false, // essential
        contentType: false, // essential, application/pdf doesn't work.
        enctype: 'multipart/form-data',
        success: function (response) {
            document.getElementById(form_field_id).value = response[response_field]
            //Game : Highlight selected number box with different colors
            if(button_id == "recordButton_5") 
            {
                const numbersArray = (response[response_field]).split("");
                document.getElementById('number_'+numbersArray[0]).className = 'select-number-color1 number-box';
                document.getElementById('number_'+numbersArray[1]).className = 'select-number-color2 number-box';
            }
            alert("Response received successfully : " + response[response_field])
        },
        error: function(response) {
            alert("Error occured : " + response.responseJSON["errMsg"])
        }
    });    
}