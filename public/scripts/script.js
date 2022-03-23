

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '5000'
});
let myVideoStream
 
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    
    peer.on('call', call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    myVideoStream.getVideoTracks()[0].enabled = false;
    myVideoStream.getAudioTracks()[0].enabled = false;
    socket.on("user-connected", (userId) => {
        console.log("user connected...........");
            setTimeout(() => {
                connectToNewUser(userId, stream);
            },3000)
      })
    
    

        let text = $('input')
    $('html').keydown((e)=>{
        if(e.which == 13 && text.val().length !==0){
            // console.log("message");
            socket.emit('message', text.val());
            text.val('');
        }
    });

    socket.on('createMessage', (message) =>{
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToBottom()
    })
})
// let id= ROOM_ID;
peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
    
}) 
  
const connectToNewUser = (userId, stream)=>{
    const call =  peer.call(userId, stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream);
    })
}
 
const addVideoStream = (video, stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);

}

const scrollToBottom = () =>{
    let d = $('.chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}





////////////////////////////////////////////////// Mute unmute audio

    const muteUnmute = () =>{
        const enabled = myVideoStream.getAudioTracks()[0].enabled;
        if(enabled){
            myVideoStream.getAudioTracks()[0].enabled = false;
            setUnmuteButton();
        }
        else{
            setMuteButton();
            myVideoStream.getAudioTracks()[0].enabled = true; 
        }
    }
    
    const setMuteButton = ()=>{
        const html = `<i class="mute main_controls_btn fas fa-microphone">
        <span>Audio</span>
        </i>
        `
        document.querySelector('.mute_btn').innerHTML = html;
    }
    
    const setUnmuteButton = ()=>{
        const html = `<i class="unmute main_controls_btn fas fa-microphone-slash">
        <span>Audio</span>
        </i>
        `
        document.querySelector('.mute_btn').innerHTML = html;
    }
    
    
    
///////////////////////////////////////////// Disable enable Video

    const videoStop = () =>{
        const enabled = myVideoStream.getVideoTracks()[0].enabled;
        if(enabled){
            myVideoStream.getVideoTracks()[0].enabled = false;
            setPlayVideo();

        }
        else{
            setStopVideo();
            myVideoStream.getVideoTracks()[0].enabled = true; 

        }
    }

    const setStopVideo = ()=>{
        const html = `<i class="stop-video main_controls_btn fas fa-video">
        <span>Camera</span>
        </i>
        `
        document.querySelector('.video_btn').innerHTML = html;
    }
    
    const setPlayVideo = ()=>{
        const html = `<i class="play main_controls_btn fas fa-video-slash">
        <span>Camera</span>
        </i>
        `
        document.querySelector('.video_btn').innerHTML = html;
    }