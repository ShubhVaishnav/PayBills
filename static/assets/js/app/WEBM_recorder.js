var recorder, audioStream;
var recordButton = document.getElementById("recordButton_1");

var recordButton_1 = document.getElementById("recordButton_1");
var recordButton_2 = document.getElementById("recordButton_2");
var recordButton_3 = document.getElementById("recordButton_3");

recordButton.addEventListener("click", toggleRecording);

recordButton_1.addEventListener("click", toggleRecording);
recordButton_2.addEventListener("click", toggleRecording);
recordButton_3.addEventListener("click", toggleRecording);

var toggleState = false;

var toggleState_recordButton_1 = false;
var toggleState_recordButton_2 = false;
var toggleState_recordButton_3 = false;

var toggleState_dict = {
    "toggleState_recordButton_1" : false,
    "toggleState_recordButton_2" : false,
    "toggleState_recordButton_3" : false,
};

var recorder_dict = {
    "recorder_recordButton_1" : null,
    "recorder_recordButton_2" : null,
    "recorder_recordButton_3" : null,
}

// function toggleRecording(e) {
//     console.log("toggleRecording called", toggleState);

//     if (toggleState == true) {
//         console.log("Returning")
//         return;
//     }
//     toggleState = true;

//     console.log("toggleRecording", toggleState);
//     e.stopPropagation();
//     e.preventDefault();
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//         console.log('getUserMedia supported.toggleState:', toggleState);
//         if (recorder && recorder.state == 'recording') {
//             console.log("Stopping the recorder");
//             recorder.stop();
//             console.log("recorder.state", recorder.state);
//             //recordButton.innerHTML = "Tap to Record";
//             document.getElementById("recordButton").innerHTML = "Tap to Record";
//             audioStream.getAudioTracks()[0].stop();
//             toggleState = false;
//             console.log("stop recorder", toggleState)
//         }
//         else {
//             navigator.mediaDevices.getUserMedia(
//                 // constraints - only audio needed for this app
//                 {
//                     audio: true,
//                     video: false,
//                     debug: true
//                 })
//                 // Success callback
//                 .then(function (stream) {
//                     audioStream = stream;

//                     if (MediaRecorder.isTypeSupported('audio/webm; codecs=opus')) {
//                         options = { mimeType: 'audio/webm; codecs=opus' }
//                     }
//                     else if (MediaRecorder.isTypeSupported('audio/ogg; codecs=opus')) {
//                         options = { mimeType: 'audio/ogg; codecs=opus' }
//                     }
//                     recorder = new MediaRecorder(stream, options);
//                     let chunks = [];

//                     recorder.ondataavailable = function (e) {
//                         if (e.data.size > 0) {
//                             console.log("Data available", e.data);
//                             console.log("chunks before", chunks)
//                             chunks.push(e.data);
//                             console.log("chunks after", chunks)
//                         }
//                     }
//                     if (recorder && recorder.state == 'inactive') {
//                         recorder.start();
//                         //recordButton.innerHTML = "Stop recording";
//                         document.getElementById("recordButton").innerHTML = "Stop recording";
//                         console.log("recorder.state", recorder.state);
//                         console.log("The recorder started");
//                     }

//                     recorder.onstop = function (e) {
//                         console.log("recorder stopped");
//                         document.getElementById("recordButton").innerHTML = "Tap to Record";
//                         const audioBlob = new Blob(chunks, { 'type': recorder.mimeType });
//                         //const audioBlob = new Blob(chunks, { 'type' : 'audio/wav; codecs=MS_PCM' });
//                         console.log("audioBlob", audioBlob)
//                         chunks = [];
                        
//                         //const audioURL = window.URL.createObjectURL(audioBlob);
//                         sendData(audioBlob)       
//                     }
//                     toggleState = false;
//                     console.log("success callback", toggleState)

//                     setTimeout(() => {
//                         if (recorder.state == 'recording') {
//                             console.log("Recording timeout after 5 sec")
//                             recorder.stop();
//                         }
//                     }, 5000);
//                 })
//                 // Error callback
//                 .catch(function (err) {
//                     console.log('The following getUserMedia error occurred: ' + err);
//                 });
//         }
//     }
//     else {
//         console.log('getUserMedia not supported on your browser!');
//     }
// }

function toggleRecording(e) {

    var $this = $(this);
    id = $this.attr('id')
    console.log("start", id)
    
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
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.toggleState:', toggleState_dict['toggleState_'+id]);
        if (recorder_dict['recorder_'+id] && recorder_dict['recorder_'+id].state == 'recording') {
            console.log("Stopping the recorder");
            recorder_dict['recorder_'+id].stop();
            console.log("recorder.state", recorder_dict['recorder_'+id].state);
            audioStream.getAudioTracks()[0].stop();
            toggleState_dict['toggleState_'+id] = false;
            console.log("stop recorder", toggleState_dict['toggleState_'+id])
        }
        else {
            navigator.mediaDevices.getUserMedia(
                // constraints - only audio needed for this app
                {
                    audio: true,
                    video: false,
                    debug: true
                })
                // Success callback
                .then(function (stream) {
                    audioStream = stream;

                    if (MediaRecorder.isTypeSupported('audio/webm; codecs=opus')) {
                        options = { mimeType: 'audio/webm; codecs=opus' }
                    }
                    else if (MediaRecorder.isTypeSupported('audio/ogg; codecs=opus')) {
                        options = { mimeType: 'audio/ogg; codecs=opus' }
                    }
                    recorder = new MediaRecorder(stream, options);                    
                    recorder_dict['recorder_'+id] = recorder;
                    let chunks = [];

                    recorder_dict['recorder_'+id].ondataavailable = function (e) {
                        if (e.data.size > 0) {
                            console.log("Data available", e.data);
                            console.log("chunks before", chunks)
                            chunks.push(e.data);
                            console.log("chunks after", chunks)
                        }
                    }
                    if (recorder_dict['recorder_'+id] && recorder_dict['recorder_'+id].state == 'inactive') {
                        recorder_dict['recorder_'+id].start();
                        document.getElementById(id).innerHTML = "Stop recording";
                        console.log("recorder.state", recorder_dict['recorder_'+id].state);
                        console.log("The recorder started:",id);
                    }

                    recorder_dict['recorder_'+id].onstop = function (e) {
                        console.log("recorder stopped:",id);
                        document.getElementById(id).innerHTML = "Tap to Record";
                        const audioBlob = new Blob(chunks, { 'type': recorder_dict['recorder_'+id].mimeType });
                        console.log("audioBlob", audioBlob)
                        chunks = [];                        
                        
                        //const audioURL = window.URL.createObjectURL(audioBlob);
                        sendData(audioBlob, id) 
                        
                        recorder_dict['recorder_'+id] = null;

                        var voice_slider_owl = $('#voice_slider');
                        voice_slider_owl.trigger('next.owl.carousel');
                    }
                    toggleState_dict['toggleState_'+id] = false;
                    console.log("success callback", toggleState_dict['toggleState_'+id])

                    setTimeout(() => {
                        console.log("15sec timeout")
                        if(recorder_dict['recorder_'+id])
                        {
                            if (recorder_dict['recorder_'+id].state == 'recording') {
                                console.log("Recording timeout after 5 sec:", id)
                                recorder_dict['recorder_'+id].stop();
                            }
                        }
                    }, 15000);
                })
                // Error callback
                .catch(function (err) {
                    console.log('The following getUserMedia error occurred: ' + err);
                });
        }
    }
    else {
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
        alert("Error occured.")
      }
    });
  }