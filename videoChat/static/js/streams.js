// APP_ID from Agora
const APP_ID = '960ec0ec9bce4fad9cb10c770e67cfc2' 
const CHANNEL = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')
//creating a UID
let UID = sessionStorage.getItem('UID');

//creating a local client object
const client = AgoraRTC.createClient({mode : 'rtc' , codec: 'vp8'})

//creating a place where users can store their audio and video tracks

let localTracks = []
let remoteUsers = {} //this is an object

//a function that helps us join a channel and display local stream
// async function

let joinAndDisplayLocalStream = async () =>
{
    document.getElementById('room-name').innerText = CHANNEL
   //adding an event listener to handle the publish method later on for other users 
   client.on('user-published', handleUserJoined)

   //handle user left
   client.on('user-left', handleUserLeft)

   try {
   UID = await client.join(APP_ID, CHANNEL, TOKEN, UID) //join the channel
   } catch (error) {
       console.log(error)
   }
   
    //get users local audio and video tracks
    localTracks =  await AgoraRTC.createMicrophoneAndCameraTracks() //0 index of the array will be microphone and 1 will be camera track
    let player = `<div  class="video-container" id="user-container-${UID}">
    <div class="video-player" id="user-${UID}"></div>
    <div class="username-wrapper"><span class="user-name"></span></div>
 </div>`
    //  every user will have their own unique video player and what is gonna be unique is the user container

    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
    //video should be shown before and and then the variable player will be added to video stream

    localTracks[1].play(`user-${UID}`) //play the video
    //publish the audio and video tracks to the channel so that other people can see it
    await client.publish([localTracks[0], localTracks[1]])
 
}

let handleUserJoined = async (user,mediaType) => {
    remoteUsers[user.uid] = user //the key will be the uid and the value will be the user
    //local client should subscribe to the user
    await client.subscribe(user,mediaType)

    //if mediaType is video, take that users video, build a video player and display it in DOM
    if(mediaType === 'video')
    {
        //make sure that users video player doesnt already exist within the DOM
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null) {
            player.remove()
        }

        //go ahead and start building like before
        player = `<div  class="video-container" id="user-container-${user.uid}">
        <div class="video-player" id="user-${user.uid}"></div>
        <div class="username-wrapper"><span class="user-name"></span></div>
        </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType === 'audio')
    {
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) =>
{
   delete remoteUsers[user.uid]  //removing the user
   document.getElementById(`user-container-${user.uid}`).remove() //removing the container
}

//ADDING CONTROLS

//end the video chat
//remove others local audio and video tracks, and unsubscribe from this channel
let leaveAndRemoveStream = async () =>{

    //run an iteration to stop each local track
    for(let i = 0; i < localTracks.length ; i++)
    {
        localTracks[i].stop()
        localTracks[i].close()
        //stop the track, and then close it permanently
    }

    await client.leave()
    window.open('/','_self')

}

//camera on or off

let toggleCamera = async (e) =>
{
    //since this is video, local track is index 1
    //if camera is mmuted, turn it on
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = 'white'
    } else {
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'black'
    }
}

//mic on or off

let toggleMicrophone = async (e) =>
{
    //since this is mic, local track is index 0
    //if mic is muted, turn it on
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = 'white'
    } else {
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'black'
    }
}

joinAndDisplayLocalStream()

document.getElementById('leave-btn').addEventListener('click',leaveAndRemoveStream)

document.getElementById('camera-btn').addEventListener('click',toggleCamera)

document.getElementById('mic-btn').addEventListener('click',toggleMicrophone)
